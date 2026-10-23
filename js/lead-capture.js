/**
 * Service de capture de leads - Intégration Supabase
 */

const SUPABASE_URL = 'https://cdjgfywapfsyosvgtcmo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EMr5v1T88SEfs9Igv_q6XA_QlFo23oe';
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Saves the same validated form payload sent to the TATBooker bridge.
 * @param {{
 *   name: string,
 *   contact: string,
 *   email: string,
 *   phone: string,
 *   locality: string,
 *   pro_type: string,
 *   travel_profile: string,
 *   pax: string,
 *   travel_dates: string,
 *   budget_per_person: string,
 *   budget_currency: string,
 *   message: string,
 *   source: string,
 *   type: string
 * }} leadData
 */
export async function captureLead(leadData) {
    if (!supabaseClient) {
        throw new Error('Supabase client is unavailable. Check that the Supabase JS library loaded.');
    }

    const pax = leadData.pax ? Number(leadData.pax) : null;
    if (pax !== null && (!Number.isSafeInteger(pax) || pax < 1)) {
        throw new Error('The pax value must be a positive whole number.');
    }

    const lead = {
        name: leadData.name,
        contact: leadData.contact,
        email: leadData.email,
        phone: leadData.phone,
        locality: leadData.locality,
        pro_type: leadData.pro_type,
        travel_profile: leadData.travel_profile,
        pax,
        travel_dates: leadData.travel_dates,
        budget_per_person: leadData.budget_per_person,
        budget_currency: leadData.budget_currency,
        message: leadData.message,
        source: leadData.source,
        type: leadData.type
    };

    const { error } = await supabaseClient
        .from('leads')
        .insert(lead);

    if (error) {
        console.error('[Supabase] Lead insertion failed:', error.message);
        throw error;
    }

    console.log('[Supabase] Lead saved successfully.');
}
