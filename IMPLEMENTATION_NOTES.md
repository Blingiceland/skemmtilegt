# Fixed Rows Implementation

## Structure Changes

### Wages (3 fixed categories):
- Listafólk
- Starfsfólk  
- Þrif

### Alcohol (2 fixed categories):
- Bjór (Hálfir lítrar, 0.5L each)
- Sterkt áfengi (Sjússar 3cl, 0.03L each)

### VSK (3 fixed categories):
- Leiga á búnaði (24%)
- Hljóðmaður (24%)
- Matur & Drykkur (11%) - AUTO-CALCULATED from alcohol sales

## Key Features:
1. No add/remove buttons - all rows are fixed
2. Alcohol revenue automatically appears in VSK section
3. Total alcohol sales = sum of (unitCount × unitPrice) for both alcohol types
4. VSK on alcohol calculated at 11% rate
