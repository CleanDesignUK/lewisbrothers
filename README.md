# Lewis Brothers Roofing & Plastering website, V3

## Global navbar and footer

The navbar and footer are now true shared components:

- `components/navbar.html`
- `components/footer.html`

Every page contains only:

```html
<div data-global-header></div>
...
<div data-global-footer></div>
```

`js/components.js` loads the two shared files. Change the navbar or footer once in the component file and the change appears on every page.

Because the components are loaded with `fetch()`, preview the website through a web server rather than double-clicking `index.html`. VS Code Live Server, GitHub Pages, Hostinger and normal hosting all work.

## Central business details

Edit phone, email, address, social links and Web3Forms key once in:

`js/config.js`

Set:

```js
web3FormsAccessKey: 'YOUR_REAL_WEB3FORMS_KEY'
```

before publishing.

## Homepage

The homepage has:

- sticky white pill navbar
- Home, About, Services dropdown, Contact and call button
- compact form-focused hero
- smooth rounded hero edges
- Anglesey-first H1 with Llangefni relevance in the supporting line
- transparent/glass hero form
- no hero message box
- all visible hero fields required
- Web3Forms AJAX submission and SweetAlert success message
- UK phone validation and obvious repeated-number blocking
- email validation and basic disposable-address blocking
- honeypot and Web3Forms botcheck
- lower full enquiry form
- responsive horizontal card scrollers on smaller screens
- brand-blue floating WhatsApp button labelled "Chat with us"
- cookie preferences banner
- LocalBusiness/RoofingContractor and FAQ structured data

## Placeholder pages

The planned pages are included as lightweight `noindex` scaffolds so navigation can be tested now:

- `about.html`
- `services.html`
- `epdm-rubber-roofing.html`
- `roofing-services.html`
- `plastering-services.html`
- `contact.html`

Replace the scaffold content as each page is built, then change its robots meta tag to `index, follow` when ready.

## Hero stock image

The current hero uses a temporary Pexels roofing photograph via a remote URL in `css/index.css`. Replace it with a real Lewis Brothers project image before launch if possible.
