# Afro Crown Market — Premium V2

This version upgrades the original marketplace substantially.

## Major upgrades

### Real product photography
The catalogue now uses actual photographic product imagery loaded from image CDNs instead of emoji product illustrations.

### Much larger catalogue
There are now **28 products** across:
- Kidswear
- Teen fashion
- African wears
- Accessories
- Furniture & home
- Bags, hats, jewellery and gifts

### Search actually works
Search now:
- filters as you type
- works with Enter
- supports category selection
- searches product names and catalogue keywords
- shows the number of matching products
- has sorting by featured, price low/high and newest

### Real account page
The **Account & Lists** area now opens `account.html`, a separate premium account page with:
- Sign in
- Create account
- Password field
- Name field for registration
- Forgot password interaction
- Guest shopping
- Demo account persistence

The current account system is front-end/demo authentication. For real users, connect Firebase Authentication, Supabase Auth, Auth0 or your own backend.

## Running it

Open the `afro_crown_market_v2` folder in VS Code and use Live Server.

Important: because `script.js` loads `products.json`, don't rely on opening `index.html` directly with `file://`. Use VS Code Live Server.

## Production next steps

1. Replace demo image URLs with owned/licensed product photography.
2. Connect Stripe or PayPal.
3. Connect Firebase/Supabase for real authentication.
4. Add a database and admin product dashboard.
5. Add stock, sizes, colours and variants.
6. Add delivery/tax calculation.
7. Add order tracking and customer order history.
8. Add seller onboarding for African makers.
9. Add product reviews and verified purchases.
