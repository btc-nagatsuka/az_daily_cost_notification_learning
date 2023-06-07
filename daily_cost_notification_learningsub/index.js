require('date-utils');

module.exports = async function (context, req) {
  try{
    context.log.info("Process Started");

    // Get billing data from the request body
    const billingData = req.body;
    
    //昨日の日付を取得
    const dt = new Date();
    dt.setDate(dt.getDate() - 1);
    const yesterday = dt.toFormat("YYYYMMDD");

    // Format billing data
    const formattedbillingData = formatBillingData(billingData, yesterday);
    
    // Create Message
    const message = createMessage(formattedbillingData, yesterday) 

    // Return formatted billing data
    context.log.info("Process Finished");
    return context.res = {
        body: message
    };
  }catch(e){
    context.log.error(e)
    return context.res = {
      body: e
  };
}
};

/**
 * 当該日付のResourceTypeごとの利用料合計を算出する
 * @param {*} billingData 
 * @param {string} strDate
 * @returns {Object} monthlyCostsByResourceType
 */
function formatBillingData(billingData, strDate) {
    let dailyCostsByResourceType = {};

    // ループ処理で日別のResourceTypeごとの合計を算出する
    billingData.properties.rows.forEach((row) => {
      const preTaxCost = row[0];
      const usageDate = row[1].toString();
      const resourceType = row[2];
  
      if (!dailyCostsByResourceType[usageDate]) {
        dailyCostsByResourceType[usageDate] = {};
      }
  
      if (!dailyCostsByResourceType[usageDate][resourceType]) {
        dailyCostsByResourceType[usageDate][resourceType] = 0;
      }
  
      dailyCostsByResourceType[usageDate][resourceType] += preTaxCost;
    });

    // 処理当日のデータのみ抽出
    let costsByResourceTypeArray;
    Object.entries(dailyCostsByResourceType).forEach(([key, values])=>{
      if(key == strDate){
        costsByResourceTypeArray = Object.entries(values);
      }
    });

    let result = []
    costsByResourceTypeArray.forEach((value)=>{
      let cost = value[1]
      if(cost > 0){
        const costFloored = Math.floor(cost * Math.pow(10, 2)) / Math.pow(10, 2)
        // const costFloored = costTemp/100
        result.push([value[0],costFloored])
      }else{
        result.push([value[0],cost])
      }
    });
  
    return result;
  }

  /**
   * Teams投稿用のメッセージを作成する
   * @param {*} billingData 
   * @param {string} strDate
   * @returns 
   */
  function createMessage(billingData, strDate) {
    let bilingDataStr = "";
    let totalCost = 0;
    billingData.forEach((row) => {
      bilingDataStr += row[0] + "\t" + "￥" + row[1] + "\n\n";
      totalCost += row[1]
    });
    const totalCostFloored = totalCost > 0 ? Math.floor(totalCost * Math.pow(10, 2)) / Math.pow(10, 2) : 0;

    // Teamsメッセージ作成
    let message = "Azure学習用サブスクリプション請求情報 (" + strDate + " 0:00 - 23:59)" + "\n\n";
    message += "```" + "\n" + bilingDataStr +"\n";
    message += "----------------------------------------------" + "\n"
    message += "合計" + "￥" + totalCostFloored + "\n\n" + "```" + "\n\n";
    message += "※ 金額は、ディスカウント適用前で、少数第3位以下を切捨てています。";

    return message;
  }

  // formatBillingData 処理結果
  // {
  //   "202301": {
  //     "microsoft.compute/disks": 409.61009034086413,
  //     "microsoft.logic/workflows": 0.0076375600000000024,
  //     "microsoft.network/bastionhosts": 2490.5574678532207
  //   },
  //   "202302": {
  //     "microsoft.compute/disks": 204.80504517043207,
  //     "microsoft.logic/workflows": 0.0038187800000000012,
  //     "microsoft.network/bastionhosts": 1245.2787339266104
  //   }
  // }

// テスト用Input
// const billingData = {
//     "id": "subscriptions/XXXX/providers/Microsoft.CostManagement/query/XXXX",
//     "name": "XXXX",
//     "type": "Microsoft.CostManagement/query",
//     "location": null,
//     "sku": null,
//     "eTag": null,
//     "properties": {
//       "nextLink": null,
//       "columns": [
//         {
//           "name": "PreTaxCost",
//           "type": "Number"
//         },
//         {
//           "name": "UsageDate",
//           "type": "Number"
//         },
//         {
//           "name": "ResourceType",
//           "type": "String"
//         },
//         {
//           "name": "Currency",
//           "type": "String"
//         }
//       ],
//       "rows": [
//         [
//           204.80504517043207,
//           20230101,
//           "microsoft.compute/disks",
//           "JPY"
//         ],
//         [
//           0.0038187800000000012,
//           20230101,
//           "microsoft.logic/workflows",
//           "JPY"
//         ],
//         [
//           1245.2787339266104,
//           20230101,
//           "microsoft.network/bastionhosts",
//           "JPY"
//         ],
//         [
//         204.80504517043207,
//         20230102,
//         "microsoft.compute/disks",
//         "JPY"
//         ],
//         [
//         0.0038187800000000012,
//         20230102,
//         "microsoft.logic/workflows",
//         "JPY"
//         ],
//         [
//         1245.2787339266104,
//         20230102,
//         "microsoft.network/bastionhosts",
//         "JPY"
//         ],
//         [
//         204.80504517043207,
//         20230201,
//         "microsoft.compute/disks",
//         "JPY"
//         ],
//         [
//         0.0038187800000000012,
//         20230201,
//         "microsoft.logic/workflows",
//         "JPY"
//         ],
//         [
//         1245.2787339266104,
//         20230201,
//         "microsoft.network/bastionhosts",
//         "JPY"
//         ]
//     ]
//     } 
// }