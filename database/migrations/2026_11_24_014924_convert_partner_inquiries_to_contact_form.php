<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Inquiries are now contact messages only: they no longer carry a logo or publish a partner.
     */
    public function up(): void
    {
        DB::table('partner_inquiries')->where('status', 'approved')->update(['status' => 'contacted']);
        DB::table('partner_inquiries')->where('status', 'declined')->update(['status' => 'closed']);

        Schema::table('partner_inquiries', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });
    }

    public function down(): void
    {
        Schema::table('partner_inquiries', function (Blueprint $table) {
            $table->string('logo_path')->nullable()->after('website_url');
        });

        DB::table('partner_inquiries')->where('status', 'contacted')->update(['status' => 'approved']);
        DB::table('partner_inquiries')->where('status', 'closed')->update(['status' => 'declined']);
    }
};
