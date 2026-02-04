# **App Name**: PantryLink

## Core Features:

- Food Item Creation: Allow donors/partners to create FoodItem records (name, category, weight, condition, expirationDate, storageTemp, allergens, dietaryTags, pickupLocation).
- QR Code Generation: Generate a QR code that encodes itemId and claimToken, facilitated through a Firebase Cloud Function.
- Item Intake Management: Enable staff to mark intake stages: received, inspected, stored, allocated, picked_up/expired/trashed. Facilitated with role-based Firebase authentication and Firestore.
- Recipient Matching Engine: Recommend a Recipient or PartnerOrg based on expiration date, dietary constraints, urgency score, family size/quantity fit, and distance/pickup window. An LLM may be incorporated as a tool that assists the matching engine, by assessing recipient needs.
- Allocation Management: Enables allocation through POST /allocate which creates Allocation and locks items through firebase.
- Role-Based Access Control: Implement Firebase Auth with custom claims for admin, staff, donor, and recipient roles.
- Expiring Item Notifications: A scheduled Firebase Cloud Function that flags items expiring soon and auto-expires items after their expiration date.

## Style Guidelines:

- Primary color: Forest green (#386641) to represent freshness and health, aligning with the theme of food and well-being.
- Background color: Pale green (#E5E8E6), a desaturated version of the primary, for a calm and inviting backdrop in a light color scheme.
- Accent color: Soft orange (#A68A31), analogous to green but with contrasting brightness and saturation, to draw attention to calls to action.
- Body and headline font: 'PT Sans', a humanist sans-serif, to provide a balance of modern and approachable aesthetics for readability and a friendly interface.
- Use line icons representing food items, categories, and user actions. Ensure icons are consistent in style and weight.
- Employ a clean, grid-based layout to present food items and information clearly. Prioritize key information and calls to action using visual hierarchy.
- Incorporate subtle transitions and animations to provide feedback on user interactions, such as loading states and form submissions. Keep animations brief and purposeful.