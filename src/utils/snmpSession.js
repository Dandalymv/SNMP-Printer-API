const snmp = require("net-snmp");

function createSession(ip, community, timeout = 3000) {
  return snmp.createSession(ip, community, {
    version: snmp.Version2c,
    timeout,
  });
}

function snmpGet(session, oids) {
  return new Promise((resolve, reject) => {
    session.get(oids, (error, varbinds) => {
      if (error) return reject(error);
      return resolve(varbinds);
    });
  });
}

function snmpWalk(session, rootOid, maxRepetitions = 40) {
  return new Promise((resolve, reject) => {
    const rows = [];

    session.walk(
      rootOid,
      maxRepetitions,
      (varbinds) => {
        rows.push(...varbinds);
      },
      (error) => {
        if (error) return reject(error);
        return resolve(rows);
      }
    );
  });
}

module.exports = {
  createSession,
  snmpGet,
  snmpWalk,
  isVarbindError: snmp.isVarbindError,
};
