

interface Contact {
    id: number;
    phoneNumber: string | null;
    email: string | null;
    linkedId: number | null;
    linkPrecedence: 'primary' | 'secondary' | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

interface ContactResponse {
    contact: Contact;
    secondaryContacts: Contact[];
}

interface IdentifyContactRequest {
    phoneNumber: string | null;
    email: string | null;
}

interface ContactIdentificationResponse {
    primaryContactId: number;
    emails: string[]; // first email will be the primary email
    phoneNumbers: string[]; // first phone number will be the primary phone number
    secondaryContactIds: number[]; // secondary contact ids
}

export type { Contact, ContactResponse, IdentifyContactRequest, ContactIdentificationResponse };