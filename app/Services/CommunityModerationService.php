<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CommunityModerationService
{
    /**
     * Multilingual Banned Keywords (ID, EN, & Chinese Traditional / 繁體中文)
     */
    protected static array $bannedKeywords = [
        // English & General
        'slot', 'gacor', 'porn', 'free porn', 'sex', '18+', 'nsfw', 'gambling', 'lottery', 'easy money',

        // Bahasa Indonesia
        'judi', 'bokep', 'sange', 'deposit pulsa', 'maxwin', 'togel', 'pragmatic',

        // Chinese Traditional (繁體中文) - Gambling, Adult & Scam Keywords
        '賭博', '博彩', '色情', '成片', '成人影片', '老虎機', '百家樂', '六合彩', '洗錢', '兼職刷單',
    ];

    /**
     * Memvalidasi teks dan media sebelum postingan disimpan.
     */
    public static function validate(string $content, ?UploadedFile $media = null): void
    {
        // 1. Pengecekan Kata Kunci Multilingual Lokal (Instant)
        if (! empty(trim($content))) {
            self::checkLocalBannedKeywords($content);
        }

        $apiUser = config('services.sightengine.api_user');
        $apiSecret = config('services.sightengine.api_secret');

        if (! $apiUser || ! $apiSecret) {
            Log::warning('Sightengine API credentials tidak ditemukan.');

            return;
        }

        // 2. Moderasi Teks Multilingual via Sightengine
        if (! empty(trim($content))) {
            self::checkTextContent($content, $apiUser, $apiSecret);
        }

        // 3. Moderasi Gambar/Video via Sightengine
        if ($media) {
            self::checkMediaContent($media, $apiUser, $apiSecret);
        }
    }

    /**
     * Pengecekan kata kunci lokal multilingual
     */
    protected static function checkLocalBannedKeywords(string $text): void
    {
        $normalizedText = mb_strtolower($text);

        foreach (self::$bannedKeywords as $keyword) {
            if (str_contains($normalizedText, mb_strtolower($keyword))) {
                throw ValidationException::withMessages([
                    'content' => "Postingan diblokir: Mengandung kata/konten terlarang ('{$keyword}').",
                ]);
            }
        }
    }

    /**
     * Moderasi Teks Multilingual Sightengine API
     */
    protected static function checkTextContent(string $text, string $apiUser, string $apiSecret): void
    {
        try {
            // Pengiriman tanpa isolasi bahasa (Mendukung ID, EN, Traditional Chinese zh-Hant, dll)
            $response = Http::timeout(8)->get('https://api.sightengine.com/1.0/text/check.json', [
                'text' => $text,
                'mode' => 'rules',
                'categories' => 'profanity,personal,link,social,medical',
                'api_user' => $apiUser,
                'api_secret' => $apiSecret,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['status']) && $data['status'] === 'success') {
                    // Cek matches profanity / kata kasar
                    if (! empty($data['profanity']['matches'] ?? [])) {
                        throw ValidationException::withMessages([
                            'content' => 'Postingan Anda terdeteksi mengandung kata-kata yang tidak pantas.',
                        ]);
                    }

                    // Cek matches link terlarang (Scam, Gambling, Adult)
                    if (! empty($data['link']['matches'] ?? [])) {
                        foreach ($data['link']['matches'] as $linkMatch) {
                            $type = $linkMatch['type'] ?? '';
                            if (in_array($type, ['scam', 'gambling', 'adult'])) {
                                throw ValidationException::withMessages([
                                    'content' => 'Postingan Anda terdeteksi mengandung tautan terlarang (Scam/Judi/18+).',
                                ]);
                            }
                        }
                    }
                }
            }
        } catch (ValidationException $e) {
            throw $e; // Lempar ke Inertia/Frontend sebagai 422
        } catch (\Exception $e) {
            Log::error('Sightengine Text Error: '.$e->getMessage());
        }
    }

    /**
     * Moderasi Media (Gambar/Video) Sightengine dengan Tingkat Ketepatan Tinggi (Strict 18+ Filter)
     */
    protected static function checkMediaContent(UploadedFile $media, string $apiUser, string $apiSecret): void
    {
        try {
            $response = Http::timeout(20)->attach(
                'media',
                file_get_contents($media->getRealPath()),
                $media->getClientOriginalName()
            )->post('https://api.sightengine.com/1.0/check.json', [
                'models' => 'nudity,wad,offensive,scam,text-content',
                'api_user' => $apiUser,
                'api_secret' => $apiSecret,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['status']) && $data['status'] === 'success') {
                    $nudityRaw = $data['nudity']['raw'] ?? 0;             
                    $nudityPartial = $data['nudity']['partial'] ?? 0;     
                    $nudityErotica = $data['nudity']['erotica'] ?? 0;     
                    $weapon = $data['weapon'] ?? 0;
                    $gore = $data['gore'] ?? 0;
                    $scamProb = $data['scam']['prob'] ?? 0;

                    if ($nudityRaw > 0.05 || $nudityPartial > 0.15 || $nudityErotica > 0.2) {
                        throw ValidationException::withMessages([
                            'media' => 'Media rejected: Detected as containing nudity or 18+ (NSFW).',
                        ]);
                    }

                    if ($weapon > 0.5 || $gore > 0.5) {
                        throw ValidationException::withMessages([
                            'media' => 'Media rejected: Contains elements of violence or weapons.',
                        ]);
                    }

                    if ($scamProb > 0.5) {
                        throw ValidationException::withMessages([
                            'media' => 'Media rejected: Detected as a fraudulent or scam image.',
                        ]);
                    }
                }
            }
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Sightengine Strict Media Error: '.$e->getMessage());
        }
    }
}
