export interface PartnerLogo {
    id: number;
    name: string;
    type: string;
    website_url: string | null;
    logo_url: string | null;
}

export interface SelectChoice {
    value: string;
    label: string;
}
