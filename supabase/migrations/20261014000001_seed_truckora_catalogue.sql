-- ==============================================================================
-- TRUCKORA REALISTIC SEED DATA (EUROPEAN COMMERCIAL TRUCK FLEET)
-- Truck Parts. Trusted Supply.
-- Seed script for Truck Manufacturers, Models, Categories, Suppliers, and Products
-- ==============================================================================

-- 1. SEED TRUCK MANUFACTURERS
INSERT INTO public.truck_manufacturers (id, name, slug, country, is_popular, display_order)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'DAF', 'daf', 'Netherlands', true, 1),
    ('a0000000-0000-0000-0000-000000000002', 'Volvo Trucks', 'volvo', 'Sweden', true, 2),
    ('a0000000-0000-0000-0000-000000000003', 'Scania', 'scania', 'Sweden', true, 3),
    ('a0000000-0000-0000-0000-000000000004', 'Mercedes-Benz', 'mercedes-benz', 'Germany', true, 4),
    ('a0000000-0000-0000-0000-000000000005', 'MAN', 'man', 'Germany', true, 5),
    ('a0000000-0000-0000-0000-000000000006', 'IVECO', 'iveco', 'Italy', true, 6),
    ('a0000000-0000-0000-0000-000000000007', 'Renault Trucks', 'renault-trucks', 'France', true, 7)
ON CONFLICT (name) DO UPDATE SET is_popular = EXCLUDED.is_popular, display_order = EXCLUDED.display_order;

-- 2. SEED TRUCK MODELS
INSERT INTO public.truck_models (id, manufacturer_id, name, slug, series, year_from, year_to)
VALUES
    -- DAF
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'XF 106 Euro 6', 'xf-106', 'XF', 2013, 2021),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'XF 105', 'xf-105', 'XF', 2005, 2013),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'CF 85', 'cf-85', 'CF', 2006, 2021),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'XG / XG+', 'xg-plus', 'NextGen', 2021, 2026),

    -- Volvo
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'FH4 (Euro 6)', 'fh4-euro-6', 'FH', 2013, 2020),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'FH16', 'fh16', 'FH', 2014, 2025),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'FM', 'fm', 'FM', 2014, 2024),

    -- Scania
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'R-Series (R450 / R500)', 'r-series', 'R', 2016, 2025),
    ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 'S-Series (S500 / S650 V8)', 's-series', 'S', 2016, 2026),

    -- Mercedes-Benz
    ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', 'Actros MP4', 'actros-mp4', 'Actros', 2011, 2018),
    ('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', 'Actros MP5 MirrorCam', 'actros-mp5', 'Actros', 2018, 2025),
    ('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000004', 'Arocs Construction', 'arocs', 'Arocs', 2013, 2025),

    -- MAN
    ('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', 'TGX Euro 6', 'tgx-euro-6', 'TGX', 2014, 2024),
    ('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', 'TGS Heavy Duty', 'tgs', 'TGS', 2014, 2024),

    -- IVECO
    ('b0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000006', 'Stralis Hi-Way', 'stralis-hi-way', 'Stralis', 2013, 2019),
    ('b0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000006', 'S-Way Euro 6', 's-way', 'S-Way', 2019, 2026),

    -- Renault Trucks
    ('b0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000007', 'Range T / T-High', 'range-t', 'T', 2013, 2025)
ON CONFLICT (manufacturer_id, slug) DO NOTHING;

-- 3. SEED CATEGORIES (13 Core Truck Spares Categories)
INSERT INTO public.categories (id, name, slug, description, icon_name, display_order)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Engines & Components', 'engines', 'Complete engines, cylinder heads, crankshafts, turbos and overhaul kits.', 'Cog', 1),
    ('c0000000-0000-0000-0000-000000000002', 'Gearboxes & Transmission', 'gearboxes-and-transmission', 'Manual, automated (TraXon, I-Shift, Opticruise) and retarders.', 'Activity', 2),
    ('c0000000-0000-0000-0000-000000000003', 'Brakes & Air Systems', 'brakes', 'Calipers, brake discs, air compressors, EBS valves, brake chambers.', 'Disc', 3),
    ('c0000000-0000-0000-0000-000000000004', 'Clutch Systems', 'clutch', 'Clutch kits, flywheels, release bearings and clutch servos.', 'RotateCw', 4),
    ('c0000000-0000-0000-0000-000000000005', 'Cabin & Body Parts', 'cabin-and-body-parts', 'Bumpers, headlights, grilles, cab suspension, mirrors and steps.', 'Truck', 5),
    ('c0000000-0000-0000-0000-000000000006', 'Chassis & Suspension', 'chassis-and-suspension', 'Air bellows, shock absorbers, leaf springs, stabilizers and torque rods.', 'Anchor', 6),
    ('c0000000-0000-0000-0000-000000000007', 'Electrical & Electronics', 'electrical-and-electronics', 'Alternators, starter motors, ECUs, sensors, wiring harnesses.', 'Zap', 7),
    ('c0000000-0000-0000-0000-000000000008', 'Cooling Systems', 'cooling-systems', 'Radiators, charge air coolers (intercoolers), viscous fans, water pumps.', 'Thermometer', 8),
    ('c0000000-0000-0000-0000-000000000009', 'Fuel Systems', 'fuel-systems', 'High-pressure common rail pumps, injectors, tanks and fuel filters.', 'Droplets', 9),
    ('c0000000-0000-0000-0000-000000000010', 'Exhaust & Aftertreatment', 'exhaust-and-aftertreatment', 'AdBlue dosing units, DPF filters, SCR catalysts, NOx sensors.', 'Wind', 10),
    ('c0000000-0000-0000-0000-000000000011', 'Steering', 'steering', 'Steering gearboxes, power steering pumps, drag links and tie rods.', 'Compass', 11),
    ('c0000000-0000-0000-0000-000000000012', 'Hydraulics', 'hydraulics', 'PTO pumps, tipping valves, hydraulic oil tanks and cylinders.', 'Gauge', 12),
    ('c0000000-0000-0000-0000-000000000013', 'Tyres & Rims', 'tyres-and-rims', 'Alcoa forged aluminium wheels, steel rims, wheel studs and hub caps.', 'Circle', 13)
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, display_order = EXCLUDED.display_order;

-- 4. SEED DEMONSTRATION SUPPLIERS
INSERT INTO public.suppliers (id, name, code, contact_email, phone, country, is_verified, is_public, rating)
VALUES
    ('s0000000-0000-0000-0000-000000000001', 'TRUCKORA European Central Hub', 'TRK-CENTRAL', 'central-logistics@truckora.eu', '+31 10 555 4900', 'Netherlands', true, true, 4.95),
    ('s0000000-0000-0000-0000-000000000002', 'Nordic Commercial Rebuilders', 'NCR-SWEDEN', 'supply@nordictruck.se', '+46 31 799 1200', 'Sweden', true, true, 4.88),
    ('s0000000-0000-0000-0000-000000000003', 'Rhine Driveline & Transmission GmbH', 'RDT-GERMANY', 'b2b@rhinedriveline.de', '+49 211 4088 330', 'Germany', true, true, 4.92)
ON CONFLICT DO NOTHING;

-- 5. SEED INITIAL REALISTIC PRODUCTS
INSERT INTO public.products (
    id, sku, name, slug, oem_number, alternative_oem_numbers,
    category_id, supplier_id, condition, refurbishment_status,
    price_cents, currency, vat_rate_percent, stock_quantity,
    weight_kg, dimensions_cm, short_description, description,
    technical_specifications, warranty_months, is_featured, status
)
VALUES
    -- 1. Turbocharger DAF XF 106
    (
        'd0000000-0000-0000-0000-000000000001',
        'TRK-ENG-1853604',
        'Holset HE400VG Variable Geometry Turbocharger',
        'holset-he400vg-turbocharger-daf-xf-106',
        '1853604',
        ARRAY['1944459', '2134012', '5355091'],
        'c0000000-0000-0000-0000-000000000001',
        's0000000-0000-0000-0000-000000000001',
        'refurbished',
        'Factory bench-tested with dynamic high-speed balancing & new VGT actuator',
        145000, -- €1,450.00
        'EUR',
        21.00,
        6,
        28.5,
        '45x38x32',
        'OEM Holset HE400VG VGT Turbocharger for DAF XF 106 Euro 6 PACCAR MX-13 engines.',
        'Precision reconditioned turbocharger engineered for maximum thermal efficiency and low emissions compliance. Includes electronic actuator calibration report and complete mounting gasket kit.',
        '{"Manufacturer": "Holset / Cummins", "Engine Model": "PACCAR MX-13", "Emissions Class": "Euro 6", "Actuator Type": "Electronic VGT", "Cooling Type": "Water & Oil Cooled"}'::JSONB,
        24,
        true,
        'published'
    ),
    -- 2. Air Brake Compressor Volvo FH4
    (
        'd0000000-0000-0000-0000-000000000002',
        'TRK-BRK-21543897',
        'Wabco Dual Cylinder Air Compressor 636cc',
        'wabco-dual-cylinder-air-compressor-volvo-fh4',
        '21543897',
        ARRAY['22062019', '85013915', '9125120020'],
        'c0000000-0000-0000-0000-000000000003',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        89000, -- €890.00
        'EUR',
        21.00,
        12,
        19.8,
        '34x28x25',
        'Brand new genuine Wabco dual-cylinder high output compressor for Volvo D13K engines.',
        'Heavy-duty dual-piston air compressor delivering high volumetric efficiency. Built with energy-saving clutching system for optimal fuel economy and longevity under intensive transport duty cycles.',
        '{"Manufacturer": "Wabco", "Displacement": "636 cc", "Pistons": "2", "Max Pressure": "14.5 Bar", "Drive": "Engine Gear Driven"}'::JSONB,
        12,
        true,
        'published'
    ),
    -- 3. Disc Brake Caliper Knorr-Bremse SN7000 Mercedes Actros
    (
        'd0000000-0000-0000-0000-000000000003',
        'TRK-BRK-A0004204500',
        'Knorr-Bremse SN7000 Left Front Brake Caliper',
        'knorr-sn7000-front-caliper-mercedes-actros',
        'A0004204500',
        ARRAY['K003811', '0044206001', 'A0044206001'],
        'c0000000-0000-0000-0000-000000000003',
        's0000000-0000-0000-0000-000000000003',
        'new',
        NULL,
        42500, -- €425.00
        'EUR',
        21.00,
        18,
        34.0,
        '48x36x24',
        'Original Knorr-Bremse SN7000 series pneumatic disc brake caliper for Actros MP4/MP5 22.5" wheels.',
        'High performance sliding caliper engineered with patented guide pin seals and dual-tappet synchronous adjustment mechanism. Pre-fitted with premium heavy-duty boots and slider pins.',
        '{"Brand": "Knorr-Bremse", "Axle Position": "Front Axle Left", "Wheel Size": "22.5 inch", "Model Reference": "SN7000", "Pad Thickness Compatibility": "30mm"}'::JSONB,
        12,
        true,
        'published'
    ),
    -- 4. Scania Retarder Assembly R-Series
    (
        'd0000000-0000-0000-0000-000000000004',
        'TRK-GBX-1934322',
        'Scania R4100 Freewheeling Retarder Assembly',
        'scania-r4100-freewheeling-retarder-assembly',
        '1934322',
        ARRAY['2065188', '2415690', '1802931'],
        'c0000000-0000-0000-0000-000000000002',
        's0000000-0000-0000-0000-000000000002',
        'used',
        'Tested on dynamic driveline test rig, zero leaks, oil analysis passed, 192,000 km verified runtime',
        235000, -- €2,350.00
        'EUR',
        21.00,
        2,
        68.0,
        '55x50x45',
        'Original Scania R4100 disengaging hydraulic auxiliary retarder for G, R, and S Series.',
        'Reduces brake wear by up to 90% during downhill descents. Disengages completely when not active to eliminate parasitic drag and save diesel fuel on long-haul highway transport.',
        '{"Braking Torque": "4100 Nm", "System": "Hydraulic Auxiliary Retarder", "Transmission Fitment": "GRSO905 / GRS905", "Condition Grade": "A+ Verified Used"}'::JSONB,
        6,
        false,
        'published'
    ),
    -- 5. Bosch High Pressure Common Rail Pump MAN TGX
    (
        'd0000000-0000-0000-0000-000000000005',
        'TRK-FUL-51091007742',
        'Bosch CP4.2 Twin-Piston High Pressure Common Rail Pump',
        'bosch-cp4-fuel-pump-man-tgx-d2676',
        '51091007742',
        ARRAY['51091007765', '0445020138', '0986437349'],
        'c0000000-0000-0000-0000-000000000009',
        's0000000-0000-0000-0000-000000000001',
        'refurbished',
        'Bosch certified overhaul with new metering valve, cam lobes, and high pressure seals',
        98000, -- €980.00
        'EUR',
        21.00,
        8,
        14.2,
        '30x26x24',
        'Precision Bosch common rail pump delivering up to 2500 bar fuel rail pressure for MAN D2676 engines.',
        'Fully calibrated on Bosch EPS 708 test bench. Includes genuine Bosch test certificate and individual calibration matrix code.',
        '{"Brand": "Bosch", "Pump Type": "CP4.2 Twin Cylinder", "Max Rail Pressure": "2500 bar", "Engine": "MAN D2676 LF Euro 6", "Metering Unit": "Integrated Electronic"}'::JSONB,
        24,
        true,
        'published'
    ),
    -- 6. Sachs Dual Mass Clutch Kit DAF XF / CF
    (
        'd0000000-0000-0000-0000-000000000006',
        'TRK-CLT-1944458',
        'ZF Sachs 430mm Heavy Duty Clutch Kit with Release Bearing',
        'sachs-430mm-clutch-kit-daf-xf-cf',
        '1944458',
        ARRAY['1815777', '3400700385', '053400700385'],
        'c0000000-0000-0000-0000-000000000004',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        64000, -- €640.00
        'EUR',
        21.00,
        15,
        42.0,
        '50x50x18',
        'Original Sachs 430mm push-type clutch pressure plate and disc assembly for TraXon automated transmissions.',
        'Features Sachs HD torsional damper springs and high-durability cerametallic friction facings designed for heavy haulage operations up to 44 tons GVW.',
        '{"Diameter": "430 mm", "Profile": "Spline Hub 2", "Hub": "2-Inch 10 Splines", "Wear Compensation": "Automatic XTend", "Fitment": "DAF TraXon / AS-Tronic"}'::JSONB,
        12,
        false,
        'published'
    ),
    -- 7. AdBlue Dosing Injector Unit Bosch Volvo FH4 / FH16
    (
        'd0000000-0000-0000-0000-000000000007',
        'TRK-EXH-22215234',
        'Bosch Denoxtronic 2.2 DEF AdBlue Dosing Module',
        'bosch-denoxtronic-adblue-dosing-module-volvo-fh',
        '22215234',
        ARRAY['21738132', '0444023059', '0444023060'],
        'c0000000-0000-0000-0000-000000000010',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        51000, -- €510.00
        'EUR',
        21.00,
        22,
        3.8,
        '28x22x16',
        'Genuine Bosch DEF injector module ensuring precise atomization into the SCR exhaust chamber.',
        'OEM replacement for resolving AdBlue crystallization faults and SCR de-rate errors. Delivered pre-sealed with high-temperature inlet o-rings.',
        '{"Brand": "Bosch", "System": "Denoxtronic 2.2", "Operating Voltage": "24V", "Operating Medium": "AUS32 / AdBlue", "Max Flow Rate": "7.2 kg/h"}'::JSONB,
        12,
        false,
        'published'
    ),
    -- 8. ZF Servocom 8098 Hydraulic Steering Gearbox IVECO Stralis
    (
        'd0000000-0000-0000-0000-000000000008',
        'TRK-STR-5801483321',
        'ZF Servocom 8098 Hydraulic Steering Gear',
        'zf-servocom-8098-hydraulic-steering-gear-iveco-stralis',
        '5801483321',
        ARRAY['504245604', '8098955140', '7683955101'],
        'c0000000-0000-0000-0000-000000000011',
        's0000000-0000-0000-0000-000000000003',
        'refurbished',
        'Rebuilt with genuine ZF rotary valve seals, new sector shaft bearings, 180-bar pressure test passed',
        119000, -- €1,190.00
        'EUR',
        21.00,
        5,
        48.0,
        '60x35x30',
        'Original ZF variable ratio hydraulic steering box for IVECO Stralis, S-Way and Eurocargo tractors.',
        'Delivers exact steering response and stable highway tracking with speed-dependent hydraulic power assistance and internal pressure relief valving.',
        '{"Manufacturer": "ZF Friedrichshafen", "Model": "Servocom 8098", "Max Working Pressure": "180 Bar", "Ratio": "Variable 22.2:1 - 26.2:1", "Output Shaft": "Serrated Spline"}'::JSONB,
        24,
        false,
        'published'
    ),
    -- 9. Aluminium Forged Truck Rim Alcoa Dura-Bright 22.5x9.00
    (
        'd0000000-0000-0000-0000-000000000009',
        'TRK-TYR-896523DB',
        'Alcoa Dura-Bright EVO 22.5 x 9.00 Front Steer Alloy Wheel',
        'alcoa-durabright-evo-22-5x900-alloy-wheel',
        '896523DB',
        ARRAY['896523', '896513DB', '10H335'],
        'c0000000-0000-0000-0000-000000000013',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        48000, -- €480.00
        'EUR',
        21.00,
        40,
        24.1,
        '65x65x28',
        'Ultra-lightweight forged aluminium wheel with patented Dura-Bright EVO low-maintenance surface finish.',
        'Saves up to 20kg per wheel position compared to standard steel wheels, increasing payload capacity while lowering tyre temperature and diesel consumption. Cleans with soap and water.',
        '{"Brand": "Alcoa Wheels", "Size": "22.5 x 9.00 inch", "Bolt Holes": "10", "PCD": "335 mm", "Centre Bore": "281 mm", "Offset": "161 mm", "Max Load": "4125 kg"}'::JSONB,
        60,
        true,
        'published'
    ),
    -- 10. Delco Remy 28V 150A Heavy Duty Alternator Renault T / Volvo
    (
        'd0000000-0000-0000-0000-000000000010',
        'TRK-ELC-7421944521',
        'Delco Remy 28V 150A Brushless High-Output Alternator',
        'delco-remy-28v-150a-brushless-alternator-renault-t',
        '7421944521',
        ARRAY['21944521', '8600497', 'DRA0923'],
        'c0000000-0000-0000-0000-000000000007',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        37500, -- €375.00
        'EUR',
        21.00,
        14,
        12.4,
        '30x25x22',
        'Long-life brushless heavy vehicle alternator designed for overnight cab heating & refrigeration demands.',
        'Brushless design eliminates rotor slip rings and mechanical brush wear, providing up to 1,000,000 km maintenance-free operation across severe duty European routes.',
        '{"Brand": "Delco Remy / BorgWarner", "Voltage": "28V", "Amperage": "150A", "Design": "Brushless Heavy Duty", "Rotation": "Clockwise", "Pulley": "8-Groove Poly-V"}'::JSONB,
        24,
        false,
        'published'
    ),
    -- 11. Behr Hella Engine Radiator & Intercooler Assembly MAN TGX
    (
        'd0000000-0000-0000-0000-000000000011',
        'TRK-COL-81061016524',
        'Mahle Behr Heavy Duty Engine Water Radiator',
        'mahle-behr-heavy-duty-engine-radiator-man-tgx',
        '81061016524',
        ARRAY['81061016533', '8MK376721011', 'CR547000S'],
        'c0000000-0000-0000-0000-000000000008',
        's0000000-0000-0000-0000-000000000001',
        'new',
        NULL,
        59000, -- €590.00
        'EUR',
        21.00,
        9,
        26.5,
        '105x80x15',
        'Premium aluminium brazed water cooler for MAN TGX 18.480 / 18.500 Euro 6 long distance tractors.',
        'Engineered to withstand high torsional frame stresses. Features reinforced glass-fiber polyamide tanks and corrosion-inhibited fin coatings for harsh winter road salt environments.',
        '{"Manufacturer": "Mahle / Behr", "Core Dimensions": "990 x 780 x 42 mm", "Inlet": "60 mm Quick Connect", "Outlet": "60 mm Quick Connect", "Material": "Brazed Aluminium"}'::JSONB,
        12,
        false,
        'published'
    ),
    -- 12. Complete TraXon 12-Speed Automated Transmission DAF XF 106
    (
        'd0000000-0000-0000-0000-000000000012',
        'TRK-GBX-12TX2210',
        'ZF TraXon 12TX2210 TD 12-Speed Automated Gearbox',
        'zf-traxon-12tx2210-automated-gearbox-daf-xf106',
        '1985400',
        ARRAY['2045610', '1361001010', '12TX2210TD'],
        'c0000000-0000-0000-0000-000000000002',
        's0000000-0000-0000-0000-000000000003',
        'used',
        'Thoroughly inspected, new synchronizers on splitter, synchro software calibrated, 240,000 km verified',
        385000, -- €3,850.00
        'EUR',
        21.00,
        1,
        285.0,
        '110x70x75',
        'Complete ZF TraXon 12-speed automated transmission with integrated mechatronics and clutch actuator.',
        'Direct drive (1.00) top gear version suited for high speed flat European corridors. Outstanding efficiency of 99.7% with fast shifting cycles and predictive shifting capabilities.',
        '{"Transmission Model": "ZF 12TX2210 TD", "Forward Gears": "12", "Reverse Gears": "2", "Max Input Torque": "2200 Nm", "Actuation": "Electro-Pneumatic Integrated"}'::JSONB,
        12,
        true,
        'published'
    )
ON CONFLICT (sku) DO NOTHING;

-- 6. LINK VEHICLE COMPATIBILITY FOR PRODUCTS
INSERT INTO public.product_vehicle_compatibility (product_id, model_id, engine_code, year_from, year_to, notes)
VALUES
    -- DAF Turbo -> DAF XF 106 and CF 85
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MX-13 (300kW / 340kW / 375kW)', 2013, 2021, 'Direct replacement for Euro 6 engines'),
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'MX-13 Euro 6', 2013, 2021, 'Check flange code on manifold'),

    -- Volvo Compressor -> Volvo FH4, FH16, FM
    ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'D13K (420 / 460 / 500 / 540)', 2013, 2020, 'Clutched energy-saving compressor'),
    ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'D16K', 2014, 2022, 'Heavy haulage compatible'),
    ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 'D11K / D13K', 2014, 2023, 'Standard fitting'),

    -- Mercedes Caliper -> Actros MP4 & MP5 & Arocs
    ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000010', 'OM471 / OM470', 2011, 2018, 'Front axle 7.5T disc 22.5"'),
    ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000011', 'OM471 / OM473', 2018, 2025, 'MirrorCam and classic cab fitment'),
    ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000012', 'OM471', 2013, 2024, 'Heavy duty construction series'),

    -- Scania Retarder -> Scania R & S
    ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000008', 'DC13 (450 / 500)', 2016, 2024, 'Mounts to GRS905 gearbox rear flange'),
    ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000009', 'DC16 V8 (520 / 580 / 650)', 2016, 2025, 'High torque capacity retarder')
ON CONFLICT DO NOTHING;

-- 7. SEED PRODUCT IMAGES (High quality truck part representations)
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', 'Holset HE400VG VGT Turbocharger DAF XF', true, 1),
    ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80', 'Wabco Dual Cylinder Air Compressor Volvo', true, 1),
    ('d0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80', 'Knorr-Bremse SN7000 Brake Caliper Mercedes Actros', true, 1),
    ('d0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80', 'Scania Retarder Assembly R-Series', true, 1),
    ('d0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 'Bosch High Pressure Fuel Pump MAN TGX', true, 1),
    ('d0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80', 'Sachs 430mm Heavy Duty Clutch Kit DAF', true, 1),
    ('d0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1589134777092-580dec412974?auto=format&fit=crop&w=1200&q=80', 'Bosch Denoxtronic AdBlue Module Volvo FH', true, 1),
    ('d0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 'ZF Servocom Steering Gear IVECO', true, 1),
    ('d0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', 'Alcoa Dura-Bright 22.5x9.00 Forged Alloy Wheel', true, 1),
    ('d0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80', 'Delco Remy 28V 150A Heavy Duty Alternator', true, 1),
    ('d0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 'Mahle Behr Engine Radiator MAN TGX', true, 1),
    ('d0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80', 'ZF TraXon 12TX2210 Automated Transmission DAF', true, 1)
ON CONFLICT DO NOTHING;

-- 8. SEED ACTIVE COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_cents, is_active)
VALUES
    ('TRUCKORA10', 'percentage', 10, 50000, true), -- 10% off for orders over €500
    ('FLEET50', 'fixed_cents', 5000, 100000, true)   -- €50 off for orders over €1,000
ON CONFLICT (code) DO NOTHING;
