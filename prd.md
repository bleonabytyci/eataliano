
# SHABLLON PRD (Product Requirements Document) — 1 Faqe

**Kursi:** Programimi për Pajisje Mobile (2026/2027) • **Kolegji AAB**

**Emri i Projektit:** Eatalino

**Themeluesi / Ekipi:**Bleona Btyci , 44052/26

**Data & Versioni:** Java 02 • Versioni 1.0 (Draft për MVP)

---

## 1. Përdoruesi dhe Problemi Real

* **Kush e përjeton dhimbjen?** Klientët e Eatalino-s.
* **Kur ndodh?** Kur kërkojnë menynë ose duan të porosisin.
* **Si e zgjidhin sot?** Përmes platformave të jashtme ose kanaleve të ndryshme.

## 2. Evidenca e Vëzhgimit (3 Bisedat me Përdoruesit)

* **Biseda 1 (Klient):** *"Do të doja ta shihja menynë online."*
* **Biseda 2 (Klient):** *"Dua ta gjej shpejt mënyrën e porositjes."*
* **Biseda 3 (Staf):** *"Do të ishte mirë të kishim një webfaqe zyrtare."*

## 3. Hipoteza e Vlerës

> **Nëse** krijojmë një Mobile PWA për Eatalino me menu dhe informacionet kryesore, **atëherë** klientët do ta gjejnë më lehtë informacionin dhe mënyrën e porositjes.

## 4. Rrjedha Kryesore e Përdoruesit (Core Flow — Max 5 Hapa)

1. Klienti hap webfaqen.
2. Shikon menynë.
3. Zgjedh produktin.
4. Shtyp `[Porosit]`.
5. Vazhdon te platforma e porosisë.

## 5. Kufijtë e MVP-së (Scope Contract)

* **BRENDA MVP-së (Maksimumi 3 funksione):**

  1. Menuja digjitale.
  2. Informacionet e restorantit.
  3. Linku për porosi.

* **JASHTË MVP-së (Të përjashtuara qëllimisht për këtë semestër):**

  * Pagesat me kartelë.
  * Sistem i plotë i porosive.
  * Chat i brendshëm.

## 6. Kriteret e Pranimit (Acceptance Criteria - Çfarë testohet)

* [ ] **AC-1:** Menuja shfaqet në mobile dhe desktop.
* [ ] **AC-2:** Produktet shfaqin emrin, përshkrimin dhe çmimin.
* [ ] **AC-3:** `[Porosit]` e dërgon përdoruesin te platforma e porosisë.
* [ ] **AC-4:** Aplikacioni është responsive.

## 7. Modeli Minimal i të Dhënave (Supabase PostgreSQL)

```sql
categories (id, name)

products (id, category_id, name, description, price_eur, image_url)

restaurant_info (id, name, address, phone, opening_hours, order_url)
```

## 8. Rreziku Kryesor që Duhet Testuar

* **Rreziku:** A do ta përdorin klientët webfaqen për të gjetur menynë dhe porosinë?
* **Testi në Javën 2:** Testimi me disa klientë të Eatalino-s.
