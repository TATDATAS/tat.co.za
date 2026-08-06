/**
 * Service de capture de leads - Intégration Supabase
 */

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Envoie les données du prospect vers la table 'leads'
 * @param {Object} leadData - { name, email, message }
 */
async function captureLead(leadData) {
    console.log('[Supabase] Tentative d\'insertion du lead:', leadData);
    const { data, error } = await _supabase
        .from('leads')
        .insert([
            { 
                ...leadData, 
                created_at: new Date().toISOString(),
                status: 'new'
            }
        ]);

    if (error) {
        console.error('[Supabase] Erreur lors de l\'insertion:', error.message);
        throw error;
    }
    
    console.log('[Supabase] Lead enregistré avec succès:', data);
    return data;
}
