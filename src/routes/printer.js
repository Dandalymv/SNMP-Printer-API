const express = require("express");
const router = express.Router();

const {
    createSession,
    snmpGet,
    snmpWalk,
    isVarbindError,
} = require("../utils/snmpSession");

const {
    OIDS,
    SUPPLIES_ROOT,
    OID_SUP_DESC,
    OID_SUP_MAX,
    OID_SUP_LEVEL,
    mapDeviceStatus,
    mapPrinterStatus,
} = require("../utils/statusMaps");

router.get("/:ip/info", async (req, res) => {
    const { ip } = req.params;
    const community = process.env.SNMP_COMMUNITY || "public";

    const session = createSession(ip, community, 2000);

    try {
        const varbinds = await snmpGet(session, [
            OIDS.deviceName,
            OIDS.pageCounter,
        ]);

        const [vbDeviceName, vbPageCounter] = varbinds;

        const result = {
            ip,
            deviceName: vbDeviceName?.value?.toString?.() || null,
            pageCounter: Number(vbPageCounter?.value || 0),
        };

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            error: "Error SNMP",
            details: error.toString(),
        });
    } finally {
        session.close();
    }
});

router.get("/:ip/full", async (req, res) => {
    const { ip } = req.params;
    const community = process.env.SNMP_COMMUNITY || "public";

    const session = createSession(ip, community, 3000);

    const result = {
        ip,
        basic: {},
        status: {},
        supplies: [],
    };

    try {
        const basicOids = [
            OIDS.deviceName,
            OIDS.pageCounter,
            OIDS.serialNumber,
            OIDS.deviceStatus,
            OIDS.printerStatus,
        ];

        const [
            vbDeviceName,
            vbPageCounter,
            vbSerial,
            vbDevStatus,
            vbPrinterStatus,
        ] = await snmpGet(session, basicOids);

        result.basic = {
            deviceName: vbDeviceName?.value?.toString?.() || null,
            pageCounter: Number(vbPageCounter?.value || 0),
            serialNumber: vbSerial?.value?.toString?.() || null,
        };

        const devStatusCode = Number(vbDevStatus?.value || 0);
        const prnStatusCode = Number(vbPrinterStatus?.value || 0);

        result.status = {
            deviceStatusCode: devStatusCode,
            deviceStatus: mapDeviceStatus(devStatusCode),
            printerStatusCode: prnStatusCode,
            printerStatus: mapPrinterStatus(prnStatusCode),
        };

        const allVarbinds = await snmpWalk(session, SUPPLIES_ROOT, 40);
        const suppliesMap = {};

        allVarbinds.forEach((vb) => {
            if (isVarbindError(vb) || !vb.oid) return;

            const oid = vb.oid;
            const value = vb.value;
            const parts = oid.split(".");
            const index = parts[parts.length - 1];

            if (!suppliesMap[index]) {
                suppliesMap[index] = { index };
            }

            if (oid.startsWith(OID_SUP_DESC)) {
                suppliesMap[index].description = value.toString();
            } else if (oid.startsWith(OID_SUP_MAX)) {
                suppliesMap[index].max = Number(value);
            } else if (oid.startsWith(OID_SUP_LEVEL)) {
                suppliesMap[index].level = Number(value);
            }
        });

        result.supplies = Object.values(suppliesMap)
            .filter((s) => s.description)
            .map((s) => {
                let percent = null;
                if (s.max && s.level != null && s.max > 0) {
                    percent = Math.round((s.level / s.max) * 100);
                }
                return {
                    index: s.index,
                    description: s.description,
                    level: s.level ?? null,
                    max: s.max ?? null,
                    percent,
                };
            });

        return res.json(result);
    } catch (error) {
        result.suppliesError = error.toString();
        return res.status(500).json({
            error: "Error SNMP (full)",
            details: error.toString(),
        });
    } finally {
        session.close();
    }
});

module.exports = router;
