<?php

namespace App\Http\Controllers;

use App\Models\PartnerInquiry;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Number of approved partner logos shown in the home page teaser.
     */
    private const TEASER_PARTNER_LIMIT = 8;

    /**
     * Display the public landing page.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Landing', [
            'partners' => PartnerInquiry::approvedForDisplay(self::TEASER_PARTNER_LIMIT),
        ]);
    }
}
