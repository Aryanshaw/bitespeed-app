import { Request, Response } from 'express';
import Contact from '@/models/contact';
import { IdentifyContactRequest, Contact as ContactInterface, ContactIdentificationResponse } from '@/interface/types';
import logger from '@/loaders/logger';
import { unique } from '@/helpers/helper';

interface ContactResult {
    primaryContact: ContactInterface;
    secondaryContacts: ContactInterface[];
}

const resolvePrimaryContact = async (contact: ContactInterface): Promise<ContactInterface> => {
    if (!contact.linkedId) return contact;
    const parent = await Contact.findOne({ where: { id: contact.linkedId } }) as unknown as ContactInterface;
    return resolvePrimaryContact(parent);
};

const findContact = async (phoneNumber: string | null, email: string | null): Promise<ContactResult | null> => {
    // scenarios of contact identification
    // 1. a person may join by an email or a phone number
    // 2. a contact may have multiple entries with different emails or phones
    
    if (phoneNumber && email) {
        // Both phone and email provided - search for both
        const phoneContactData: any = await Contact.findOne({ where: { phoneNumber: phoneNumber, deletedAt: null } }) as unknown as ContactInterface | null;
        const emailContactData: any = await Contact.findOne({ where: { email: email, deletedAt: null } }) as unknown as ContactInterface | null;

        const phoneContact = phoneContactData?.get() as ContactInterface | null;
        const emailContact = emailContactData?.get() as ContactInterface | null;

        if (phoneContact && emailContact) {
            if (phoneContact.id === emailContact.id) {
                // Same contact found - return it
                return {
                    primaryContact: phoneContact,
                    secondaryContacts: []
                };
            } else {
                // Different contacts found - need to merge them
                // The older one (by createdAt) becomes primary
                const isPhoneOlder = new Date(phoneContact.createdAt).getTime() < new Date(emailContact.createdAt).getTime();
                const primaryContact = isPhoneOlder ? phoneContact : emailContact;
                const secondaryContact = isPhoneOlder ? emailContact : phoneContact;
                
                // Update secondary contact to link to primary
                await Contact.update(
                    {
                        linkedId: primaryContact.id,
                        linkPrecedence: 'secondary'
                    },
                    { where: { id: secondaryContact.id } }
                );
                
                // Find all contacts linked to this primary contact
                const allSecondaryContacts = await Contact.findAll({
                    where: { linkedId: primaryContact.id }
                }) as unknown as ContactInterface[];
                
                return {
                    primaryContact: primaryContact,
                    secondaryContacts: allSecondaryContacts
                };
            }
        } else if (phoneContact) {
            // Only phone contact exists , create a new contact with the provided email and link it to the phone contact
            const newContact = await Contact.create({ 
                phoneNumber: phoneNumber, 
                email: email,
                linkPrecedence: 'secondary',
                linkedId: phoneContact.id
            }) as unknown as ContactInterface;

            return {
                primaryContact: phoneContact,
                secondaryContacts: [newContact]
            };
        } else if (emailContact) {
            // Only email contact exists , create a new contact with the provided phone number and link it to the email contact
            const newContact = await Contact.create({ 
                phoneNumber: phoneNumber, 
                email: email,
                linkPrecedence: 'secondary',
                linkedId: emailContact.id
            }) as unknown as ContactInterface;
            
            return {
                primaryContact: emailContact,
                secondaryContacts: [newContact]
            };
        }
    } else if (phoneNumber) {
        // Only phone number provided
        const match = await Contact.findOne({ where: { phoneNumber: phoneNumber } }) as unknown as ContactInterface;
        if (match) {
            const primary = await resolvePrimaryContact(match);
            const allSecondaries = await Contact.findAll({
                where: { linkedId: primary.id }
            }) as unknown as ContactInterface[];

            return {
                primaryContact: primary,
                secondaryContacts: allSecondaries
            };
        }
    } else if (email) {
        // Only email provided
        const match = await Contact.findOne({ where: { email: email } }) as unknown as ContactInterface | null;
        if (match) {
            const primary = await resolvePrimaryContact(match);
            const allSecondaries = await Contact.findAll({
                where: { linkedId: primary.id }
            }) as unknown as ContactInterface[];
    
            return {
                primaryContact: primary,
                secondaryContacts: allSecondaries
            };
        }
    }
    
    // No contact found
    return null;
}

export const identifyContact = async (req: Request, res: Response) => {
    const { phoneNumber, email } = req.body as IdentifyContactRequest;
    try {
        // check first via phoneNumber or email if the contact exists
        const contactResult = await findContact(phoneNumber, email);
        if (contactResult) {
            const response: ContactIdentificationResponse = {
                primaryContactId: contactResult.primaryContact.id,
                emails: unique([contactResult.primaryContact.email, ...contactResult.secondaryContacts.map(c => c.email)]),
                phoneNumbers: unique([contactResult.primaryContact.phoneNumber, ...contactResult.secondaryContacts.map(c => c.phoneNumber)]),
                secondaryContactIds: contactResult.secondaryContacts.map(c => c.id)
            };

            return res.status(200).json({
                contact: response
            });
        } 

        // if not found, create a new contact
        const newContact = await Contact.create({ 
            phoneNumber: phoneNumber, 
            email: email,
            linkPrecedence: 'primary'
        }) as unknown as ContactInterface;
        
        const response: ContactIdentificationResponse = {
            primaryContactId: newContact.id,
            emails: unique([newContact.email]),
            phoneNumbers: unique([newContact.phoneNumber]),
            secondaryContactIds: []
        };

        return res.status(201).json({
            contact: response
        });

    } catch (error: any) {
        logger.error('Failed to identify contact', error);
        return res.status(500).json({ error: 'Failed to identify contact', message: error.message });
    }
}