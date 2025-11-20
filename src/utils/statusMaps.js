const OIDS = {
    deviceName: "1.3.6.1.2.1.1.1.0",
    pageCounter: "1.3.6.1.2.1.43.10.2.1.4.1.1",
    serialNumber: "1.3.6.1.2.1.43.5.1.1.17.1",
    deviceStatus: "1.3.6.1.2.1.25.3.2.1.5.1",
    printerStatus: "1.3.6.1.2.1.25.3.5.1.1.1",
};

const SUPPLIES_ROOT = "1.3.6.1.2.1.43.11.1.1";
const OID_SUP_DESC = `${SUPPLIES_ROOT}.6`;
const OID_SUP_MAX = `${SUPPLIES_ROOT}.8`;
const OID_SUP_LEVEL = `${SUPPLIES_ROOT}.9`;

function mapDeviceStatus(code) {
    const map = {
        1: "unknown",
        2: "running",
        3: "warning",
        4: "testing",
        5: "down",
    };
    return map[code] || "unknown";
}

function mapPrinterStatus(code) {
    const map = {
        1: "other",
        2: "unknown",
        3: "idle",
        4: "printing",
        5: "warmup",
    };
    return map[code] || "unknown";
}

module.exports = {
    OIDS,
    SUPPLIES_ROOT,
    OID_SUP_DESC,
    OID_SUP_MAX,
    OID_SUP_LEVEL,
    mapDeviceStatus,
    mapPrinterStatus,
};
