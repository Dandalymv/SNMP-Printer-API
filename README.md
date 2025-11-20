# SNMP Printer API

API REST construida con Node.js y Express para consultar información de impresoras mediante SNMP.  
Permite obtener datos básicos, estado del dispositivo y niveles de consumibles (tóner, tambor, etc.) utilizando el MIB estándar Printer-MIB.

---

## Características

- Obtiene información básica de la impresora:
  - Nombre del dispositivo
  - Contador de páginas
  - Número de serie
- Consulta de estado:
  - Estado del dispositivo (running, warning, down, etc.)
  - Estado de impresión (idle, printing, warmup)
- Obtención de niveles de consumibles:
  - Descripción del consumible
  - Nivel actual
  - Nivel máximo
  - Porcentaje estimado

---

## Requisitos

- Node.js 20 o superior
- Acceso SNMP a las impresoras (SNMP v2c)
- Comunidad SNMP habilitada (por defecto: `public`)

---

## Instalación

npm install
npm start

---

## Configuración

Crea un archivo .env en la raíz del proyecto:

PORT=3000
SNMP_COMMUNITY=public

---

## Estructura del proyecto
src/
  routes/
    index.js
    printer.js
  utils/
    snmpSession.js
    statusMaps.js
  app.js
index.js
.env
package.json

---

## Endpoints

- Obtener información básica:
  GET /printer/:ip/info

- Obtener información completa:
  GET /printer/:ip/full

- Ejemplo de respuesta:

```json
{
  "ip": "192.168.0.123",
  "basic": {
    "deviceName": "KYOCERA Document Solutions Printing System",
    "pageCounter": 155274,
    "serialNumber": "RT123456789"
  },
  "status": {
    "deviceStatusCode": 2,
    "deviceStatus": "running",
    "printerStatusCode": 3,
    "printerStatus": "idle"
  },
  "supplies": [
    {
      "index": "1",
      "description": "TK-3182",
      "level": 20370,
      "max": 21000,
      "percent": 97
    },
    {
      "index": "2",
      "description": "Waste Toner Box",
      "level": -3,
      "max": -2,
      "percent": null
    }
  ]
}
```
---

## Autor

**ddjjmmvv**




