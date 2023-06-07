# az_daily_cost_notification_learning

```
# formatBillingData 処理結果サンプル
{
  "202301": {
    "microsoft.compute/disks": 409.61009034086413,
    "microsoft.logic/workflows": 0.0076375600000000024,
    "microsoft.network/bastionhosts": 2490.5574678532207
  },
  "202302": {
    "microsoft.compute/disks": 204.80504517043207,
    "microsoft.logic/workflows": 0.0038187800000000012,
    "microsoft.network/bastionhosts": 1245.2787339266104
  }
}
```
```
# テスト用Inputサンプル
const billingData = {
    "id": "subscriptions/XXXX/providers/Microsoft.CostManagement/query/XXXX",
    "name": "XXXX",
    "type": "Microsoft.CostManagement/query",
    "location": null,
    "sku": null,
    "eTag": null,
    "properties": {
      "nextLink": null,
      "columns": [
        {
          "name": "PreTaxCost",
          "type": "Number"
        },
        {
          "name": "UsageDate",
          "type": "Number"
        },
        {
          "name": "ResourceType",
          "type": "String"
        },
        {
          "name": "Currency",
          "type": "String"
        }
      ],
      "rows": [
        [
          204.80504517043207,
          20230101,
          "microsoft.compute/disks",
          "JPY"
        ],
        [
          0.0038187800000000012,
          20230101,
          "microsoft.logic/workflows",
          "JPY"
        ],
        [
          1245.2787339266104,
          20230101,
          "microsoft.network/bastionhosts",
          "JPY"
        ],
        [
        204.80504517043207,
        20230102,
        "microsoft.compute/disks",
        "JPY"
        ],
        [
        0.0038187800000000012,
        20230102,
        "microsoft.logic/workflows",
        "JPY"
        ],
        [
        1245.2787339266104,
        20230102,
        "microsoft.network/bastionhosts",
        "JPY"
        ],
        [
        204.80504517043207,
        20230201,
        "microsoft.compute/disks",
        "JPY"
        ],
        [
        0.0038187800000000012,
        20230201,
        "microsoft.logic/workflows",
        "JPY"
        ],
        [
        1245.2787339266104,
        20230201,
        "microsoft.network/bastionhosts",
        "JPY"
        ]
    ]
    } 
}
```