<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partner_inquiries', function (Blueprint $table) {
            $table->id();

            // Organization identity shown publicly once approved.
            $table->string('organization_name');
            $table->string('organization_type');
            $table->string('website_url')->nullable();
            $table->string('logo_path')->nullable();

            // Contact person for admin follow-up (never shown publicly).
            $table->string('contact_name');
            $table->string('contact_email');
            $table->json('involvement_interests');
            $table->text('message')->nullable();

            // Admin review workflow.
            $table->string('status')->default('new')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_inquiries');
    }
};
