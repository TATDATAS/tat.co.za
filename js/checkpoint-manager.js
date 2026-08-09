// js/checkpoint-manager.js

/**
 * Gère la logique de validation du token pour la page CheckPoint.html.
 * Lit le token de l'URL, le valide via Supabase et met à jour le statut.
 */
(async function() {
    'use strict';

    // REMPLACER CES VALEURS PAR CELLES DE VOTRE PROJET SUPABASE
    const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; 
    const SUPABASE_KEY = 'YOUR_ANON_KEY'; 
    const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const tokenParam = new URLSearchParams(window.location.search).get('token');
    const checkpointStatusDiv = document.getElementById('checkpoint-status');
    const numberInput = document.querySelector('.checkpoint-container input[type="number"]');
    const submitNumberBtn = document.getElementById('submit-number-btn');

    // Helper function to display messages
    function displayMessage(message, type = 'info') {
        if (checkpointStatusDiv) {
            checkpointStatusDiv.innerHTML = `<p class="message ${type}">${message}</p>`;
            checkpointStatusDiv.style.display = 'block';
        }
    }

    // Initial state: hide number input and button until token is validated
    if (numberInput) numberInput.style.display = 'none';
    if (submitNumberBtn) submitNumberBtn.style.display = 'none';

    if (!tokenParam) {
        displayMessage('Aucun token de checkpoint trouvé dans l\'URL.', 'error');
        console.error('[CheckPointManager] Aucun token trouvé.');
        return;
    }

    displayMessage('Vérification du token de checkpoint...', 'info');
    console.log(`[CheckPointManager] Token reçu: ${tokenParam}`);

    try {
        // 1. Vérifier la validité du token dans Supabase
        const { data, error } = await _supabase
            .from('checkpoint_tokens')
            .select('*')
            .eq('token', tokenParam)
            .single();

        if (error && error.code === 'PGRST116') { // No rows found
            displayMessage('Token de checkpoint invalide ou inexistant.', 'error');
            console.error('[CheckPointManager] Token invalide ou inexistant:', error.message);
            return;
        }
        if (error) {
            throw error;
        }

        const tokenRecord = data;

        if (tokenRecord.status !== 'generated') {
            displayMessage(`Ce checkpoint a déjà été ${tokenRecord.status}.`, 'warning');
            console.warn(`[CheckPointManager] Token déjà utilisé avec le statut: ${tokenRecord.status}`);
            return;
        }

        if (tokenRecord.expires_at && new Date(tokenRecord.expires_at) < new Date()) {
            displayMessage('Ce token de checkpoint a expiré.', 'error');
            console.warn('[CheckPointManager] Token expiré.');
            // Optionally update status to 'expired'
            await _supabase.from('checkpoint_tokens').update({ status: 'expired' }).eq('id', tokenRecord.id);
            return;
        }

        // 2. Si valide, mettre à jour le statut du token à 'scanned'
        const { error: updateError } = await _supabase
            .from('checkpoint_tokens')
            .update({ status: 'scanned', scanned_at: new Date().toISOString() })
            .eq('id', tokenRecord.id);

        if (updateError) {
            throw updateError;
        }

        displayMessage('Checkpoint validé avec succès !', 'success');
        console.log('[CheckPointManager] Checkpoint validé et statut mis à jour.');

        // Show number input and button for optional data
        if (numberInput) numberInput.style.display = 'block';
        if (submitNumberBtn) submitNumberBtn.style.display = 'block';

        if (submitNumberBtn) {
            submitNumberBtn.addEventListener('click', async () => {
                const optionalValue = numberInput ? parseInt(numberInput.value, 10) : null;
                if (optionalValue === null || isNaN(optionalValue)) {
                    displayMessage('Veuillez entrer un nombre valide.', 'warning');
                    return;
                }

                displayMessage('Envoi des données optionnelles...', 'info');
                // Assuming 'optional_value' column exists in your Supabase table
                const { error: optionalUpdateError } = await _supabase
                    .from('checkpoint_tokens')
                    .update({ optional_value: optionalValue }) 
                    .eq('id', tokenRecord.id);

                if (optionalUpdateError) {
                    displayMessage('Erreur lors de l\'envoi des données optionnelles.', 'error');
                    console.error('[CheckPointManager] Erreur lors de l\'envoi des données optionnelles:', optionalUpdateError.message);
                } else {
                    displayMessage('Données optionnelles enregistrées. Checkpoint terminé !', 'success');
                    console.log('[CheckPointManager] Données optionnelles enregistrées.');
                    if (numberInput) numberInput.style.display = 'none';
                    if (submitNumberBtn) submitNumberBtn.style.display = 'none';
                }
            });
        }

    } catch (error) {
        displayMessage(`Une erreur est survenue lors de la validation: ${error.message}`, 'error');
        console.error('[CheckPointManager] Erreur inattendue:', error.message);
    }
})();