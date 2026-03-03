# INSTRUCTIONS DE DÉVELOPPEMENT STANDARDISÉES

Pour chaque fonctionnalité ou épopée (epic) que je demande, tu dois IMPÉRATIVEMENT suivre les 3 règles suivantes avant de générer le code de production :

## RÈGLE 1 : DOCUMENTATION (.md)
Tu génères une documentation qui respecte OBLIGATOIREMENT documentation_guideline.md afin de respecter les normes du projet.
Si le fichier n'est pas fourni en contexte ou que tu ne le trouve pas dans le projet. Tu demandes à fournir ce fichier avant de continuer.

## RÈGLE 2 : STRATÉGIE DE TEST (QA)
TOUT TESTS DOIT ETRE EXECUT2 DANS LE CONEXTE ".\venv\Scripts\Activate.ps1"
Suis OBLIGATOIREMENT les instructions de tests_guideline.md avant de continuer

## RÈGLE 3 : DEVELOPPEMENT DE LA FEATURE
Suis OBLIGATOIREMENT les instructions de developpment_guideline.md pour implémenter le code.
Après avoir développé la feature, exécute les tests ET ASSURES TOI QUE TOUT LES TESTS PASSENT EN SUCCES pour t'assurer que le développement suive les règles définis lors de la "Règle 2"

## RÈGLE 4 : STRUCTURE DE LA RÉPONSE
Ta réponse doit être structurée ainsi :
Arborescence : Liste des fichiers qui seront créés (Doc + Tests + Code).
Implémentation : Explication des choix techniques et des décisions prises seules sans validation humaine synthétique.
Tu t'assures de fournir les dépendances et librairies qui ont été ajouté pour développer cette feature.