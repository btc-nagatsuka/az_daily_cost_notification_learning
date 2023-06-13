require('date-utils');

module.exports = async function (context, req) {
  try{
    context.log.info("Process Started");

    // リクエストボディから請求情報を取得
    const billingData = req.body;
    
    //昨日の日付を取得
    const dt = new Date();
    dt.setDate(dt.getDate() - 1);
    const yesterday = dt.toFormat("YYYYMMDD");

    // 請求情報を成形
    const formattedbillingData = formatBillingData(billingData, yesterday);
    
    // Teams投稿用メッセージを作成
    const message = createMessage(formattedbillingData, yesterday) 

    // レスポンスを返却
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
    let message = "AzureXXX用サブスクリプション請求情報 (" + strDate + " 0:00 - 23:59)" + "\n\n";
    message += "```" + "\n" + bilingDataStr +"\n";
    message += "----------------------------------------------" + "\n"
    message += "合計" + "￥" + totalCostFloored + "\n\n" + "```" + "\n\n";
    message += "※ 金額は、ディスカウント適用前で、小数第3位以下を切捨てています。";

    return message;
  }
