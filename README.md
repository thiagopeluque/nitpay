# NitPay | Simulador de Parcelamentos

O NitPay é mais uma facilidade que a Madeiranit oferece aos clientes marceneiros de aumentarem sua Condição de Crédito, oferencendo um meio de pagamento adicional aos Clientes

Dentro da Pasta JS é necessário criar um arquivo "taxas.json" que é onde consultamos as taxas usadas nos cálculos do Parcelamentop. O arquivo precisa ter o seguinte formato.

```
{
  "taxa_subordinado": 00,
  "markup_master": 0.7,
  "taxas_rr": {
    "x1": 0.00,
    "x2": 0.00,
    "x3": 0.00,
    "x4": 0.00,
    "x5": 0.00,
    "x6": 0.00,
    "x7": 0.00,
    "x8": 0.00,
    "x9": 0.00,
    "x10": 0.00,
    "x11": 0.00,
    "x12": 0.00
  },
  "visa": {
    "debito": 0.00,
    "credito": {
      "x1": 0.00,
      "x2": 0.00,
      "x3": 0.00,
      "x4": 0.00,
      "x5": 0.00,
      "x6": 0.00,
      "x7": 0.00,
      "x8": 0.00,
      "x9": 0.00,
      "x10": 0.00,
      "x11": 0.00,
      "x12": 0.00
    }
  }
```

Para cada bandeira exibida no site, deve existir um objeto contendo as taxas de débito e de crédito até 12x seguindo o padrão acima mostrado.