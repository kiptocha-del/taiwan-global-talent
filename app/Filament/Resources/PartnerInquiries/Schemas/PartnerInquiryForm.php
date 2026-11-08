<?php

namespace App\Filament\Resources\PartnerInquiries\Schemas;

use App\Models\PartnerInquiry;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PartnerInquiryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Review')
                ->description('Approving an inquiry publishes the organization name and logo on the public site.')
                ->schema([
                    Grid::make(2)
                        ->schema([
                            Select::make('status')
                                ->label('Status')
                                ->options(PartnerInquiry::STATUSES)
                                ->required()
                                ->native(false),

                            Placeholder::make('reviewed_at_display')
                                ->label('Reviewed At')
                                ->content(fn (?PartnerInquiry $record) => $record?->reviewed_at?->format('d M Y, H:i') ?? 'Not reviewed yet'),

                            Textarea::make('admin_notes')
                                ->label('Internal Notes')
                                ->helperText('Visible to admins only.')
                                ->rows(4)
                                ->columnSpanFull(),
                        ]),
                ]),

            Section::make('Organization')
                ->schema([
                    Grid::make(2)
                        ->schema([
                            TextInput::make('organization_name')
                                ->label('Organization Name')
                                ->required()
                                ->maxLength(255),

                            Select::make('organization_type')
                                ->label('Organization Type')
                                ->options(PartnerInquiry::ORGANIZATION_TYPES)
                                ->required()
                                ->native(false),

                            TextInput::make('website_url')
                                ->label('Website')
                                ->url()
                                ->maxLength(255),

                            FileUpload::make('logo_path')
                                ->label('Logo')
                                ->image()
                                ->disk('s3')
                                ->directory('partner-logos')
                                ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                                ->maxSize(2048)
                                ->imagePreviewHeight('120'),
                        ]),
                ]),

            Section::make('Contact & Interest')
                ->schema([
                    Grid::make(2)
                        ->schema([
                            TextInput::make('contact_name')
                                ->label('Contact Name')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('contact_email')
                                ->label('Contact Email')
                                ->email()
                                ->required()
                                ->maxLength(255),

                            CheckboxList::make('involvement_interests')
                                ->label('Wants To')
                                ->options(PartnerInquiry::INVOLVEMENT_INTERESTS)
                                ->columns(2)
                                ->columnSpanFull(),

                            Textarea::make('message')
                                ->label('Message')
                                ->rows(5)
                                ->columnSpanFull(),
                        ]),
                ]),
        ])->columns(1);
    }
}
