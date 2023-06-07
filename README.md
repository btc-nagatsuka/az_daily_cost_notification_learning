# 前提
- Node.js: v.18
- 以下作業が完了していること（詳細は「」を参照）
  - Azure Functionsを作成する
  - Logic Appsを作成する
  - Azure FunctionsでLogic AppsのマネージドIDのオブジェクトIDに対するアクセス許可を設定する
  - Logic Appsのランタイム発信IPをAzure Functionsの許可ルールに設定する

# 手順
1. 以下パスの資源を解凍し自分の環境の任意のディレクトリに配置する
   1. Dropbox (bigtreetc)\Cloud CoE\02 Azure\00 サブスクリプション管理\02 学習用サブスクリプション\コスト情報のTeams連携\az_daily_cost_notification_learning.zip
2. Azure CLIをインストールする
   1. https://learn.microsoft.com/ja-jp/cli/azure/
3. VS Code拡張機能の'Azure CLI Tools', 'Azure Tools'をインストールする
4. 以下を参考に資源をデプロイする
   1. https://rpa.bigtreetc.com/column/azure_functions_introduction/

# データサンプル
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