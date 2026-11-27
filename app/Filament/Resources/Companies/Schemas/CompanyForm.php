<?php

namespace App\Filament\Resources\Companies\Schemas;

use App\Models\CompanyProfile;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class CompanyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Account')
                ->description('The organization signs in with Google using this email address.')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Account Name')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('email')
                        ->label('Google Account Email')
                        ->email()
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(255),
                ]),

            // One relationship wrapper so the whole profile is saved in a single insert.
            Group::make()
                ->relationship('companyProfile')
                ->schema([

                    Section::make('1. Legal & Verification')
                        ->columns(2)
                        ->schema([
                            TextInput::make('company_legal_name')
                                ->label('Company Name (Legal)')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('tax_id')
                                ->label('Tax ID / NIB')
                                ->unique(ignoreRecord: true)
                                ->maxLength(100),

                            Select::make('status')
                                ->label('Verification Status')
                                ->options([
                                    CompanyProfile::STATUS_PENDING => 'Pending Review',
                                    CompanyProfile::STATUS_APPROVED => 'Approved',
                                    CompanyProfile::STATUS_REJECTED => 'Rejected',
                                    CompanyProfile::STATUS_SUSPENDED => 'Suspended',
                                ])
                                ->default(CompanyProfile::STATUS_APPROVED)
                                ->required()
                                ->native(false)
                                ->live(),

                            Textarea::make('rejection_reason')
                                ->label('Rejection Reason')
                                ->helperText('Shown to the applicant on their status page.')
                                ->visible(fn ($get) => $get('status') === CompanyProfile::STATUS_REJECTED)
                                ->required(fn ($get) => $get('status') === CompanyProfile::STATUS_REJECTED)
                                ->rows(2),
                        ]),

                    Section::make('2. Public Profile (Branding)')
                        ->columns(2)
                        ->schema([
                            TextInput::make('company_display_name')
                                ->label('Public Brand Name')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, $get, $set): void {
                                    if (blank($get('slug'))) {
                                        $set('slug', Str::slug((string) $state));
                                    }
                                }),

                            TextInput::make('slug')
                                ->label('URL Slug')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->maxLength(255),

                            Select::make('organization_type')
                                ->label('Organization Type')
                                ->options(CompanyProfile::ORGANIZATION_TYPES)
                                ->default('employer')
                                ->required()
                                ->native(false),

                            TextInput::make('industry')
                                ->label('Industry Sector')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('website_url')
                                ->label('Official Website')
                                ->url()
                                ->maxLength(255),

                            TextInput::make('company_size')
                                ->label('Company Size'),

                            TextInput::make('founded_year')
                                ->label('Founded Year')
                                ->numeric()
                                ->minValue(1800)
                                ->maxValue((int) date('Y')),

                            TextInput::make('bio')
                                ->label('Tagline')
                                ->maxLength(255),

                            Textarea::make('description')
                                ->label('Description')
                                ->rows(3)
                                ->columnSpanFull(),
                        ]),

                    Section::make('3. PIC & Contact Details')
                        ->columns(2)
                        ->schema([
                            TextInput::make('pic_name')->label('PIC Full Name')->required()->maxLength(255),
                            TextInput::make('pic_phone')->label('Phone Number')->required()->maxLength(50),
                            TextInput::make('pic_position')->label('Position')->required()->maxLength(255),
                            TextInput::make('official_email')->label('Corporate Email')->email()->maxLength(255),
                            TextInput::make('city')->label('City HQ')->maxLength(255),
                            TextInput::make('country')->label('Country')->default('Taiwan')->required()->maxLength(255),
                            Textarea::make('hq_address')->label('Full Address')->rows(2)->columnSpanFull(),
                        ]),

                    Section::make('4. Logo & Documents')
                        ->description('An approved organization with a logo appears in the partner section of the home page.')
                        ->columns(2)
                        ->schema([
                            FileUpload::make('logo_path')
                                ->label('Company Logo')
                                ->image()
                                ->disk('s3')
                                ->directory('company-logos')
                                ->maxSize(5120)
                                ->automaticallyResizeImagesMode('contain')
                                ->automaticallyResizeImagesToWidth('400')
                                ->automaticallyResizeImagesToHeight('400')
                                ->automaticallyUpscaleImagesWhenResizing(false)
                                ->imagePreviewHeight('200'),

                            FileUpload::make('banner_path')
                                ->label('Company Banner')
                                ->image()
                                ->disk('s3')
                                ->directory('company-banners')
                                ->maxSize(5120)
                                ->imagePreviewHeight('200'),

                            FileUpload::make('business_registration_path')
                                ->label('Business Registration')
                                ->disk('s3')
                                ->directory('companies/legals')
                                ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png'])
                                ->maxSize(10240),

                            Placeholder::make('document_preview')
                                ->label('Submitted Business Registration')
                                ->content(function (?CompanyProfile $record): HtmlString|string {
                                    if (! $record?->business_registration_path) {
                                        return 'No document uploaded.';
                                    }

                                    $url = e(Storage::disk('s3')->url($record->business_registration_path));

                                    return new HtmlString(
                                        "<a href=\"{$url}\" target=\"_blank\" rel=\"noopener\" style=\"color:#2f55e6;text-decoration:underline;\">Open the submitted document</a>"
                                    );
                                }),
                        ]),
                ]),
        ])->columns(1);
    }
}
