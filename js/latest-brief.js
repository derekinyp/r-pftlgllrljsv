/* 首頁「最新一期重點」與各層判定摘要。
   出刊步驟：正式週報寫入 js/issues.js 的 ISSUES 陣列最前面後，把本檔的 issueId
   改成同一期，並依該期已刊記分卡更新 headline、points、layers。
   不要在 HTML 寫死會隨新刊變動的數字或判定；本檔是唯一資料來源。
   摘要取自已刊週報／綜覽記分卡，不新增判定、不表態多空。 */
window.LATEST_BRIEF = {
  issueId: '2026-W47',
  headline: '基本面查核點達標，但融資條件與管制成為新變數',
  points: [
    {
      kind: '事實',
      text: '台積電 10 月營收、應材季度營收與 CoreWeave 季度營收均大幅年增；CPI 核心升幅觸發上期所設的 A1 升級條件。'
    },
    {
      kind: '事實',
      text: 'NVIDIA 公布高層人事異動；美國 BIS 把第三國資料中心的遠端算力納入出口管制，並訂生效日。'
    },
    {
      kind: '推論',
      text: '同一週出現自由現金流轉負與擁擠度下降的訊號。須把「誰還付得起」與「訂單本身」分開看，不能直接讀成需求消失。'
    }
  ],
  /* tone：g 符合、b 超越、r 偏離、a 觀察、n 不判。摘要為該期已刊文字的一句濃縮。 */
  layers: [
    { id: 'L0', name: 'L0 弱訊號', tone: 'a', verdict: '待觀察', summary: '無新弱訊號；3D DRAM 仍屬紙面。', group: 'chain' },
    { id: 'L1', name: 'L1 終端需求', tone: 'g', verdict: '符合', summary: '本期無新的一手需求讀數，維持符合。', group: 'chain' },
    { id: 'L2', name: 'L2 雲端資本開支', tone: 'b', verdict: '超越', summary: '大型雲端主體資本開支仍高；自由現金流出現轉負訊號。', group: 'chain' },
    { id: 'L3', name: 'L3 芯片', tone: 'b', verdict: '超越', summary: '等待後續財報查核；治理事件不改本層判定。', group: 'chain' },
    { id: 'L4', name: 'L4 記憶體', tone: 'b', verdict: '超越', summary: '無新成交價；世代拆尺提案仍未觸發。', group: 'chain' },
    { id: 'L5', name: 'L5 先進封裝', tone: 'b', verdict: '超越', summary: '生態系訊息增加，但沒有新的交期讀數。', group: 'chain' },
    { id: 'L6', name: 'L6 晶圓代工', tone: 'b', verdict: '超越', summary: '月營收再創新高，年增幅度仍高。', group: 'chain' },
    { id: 'L7a', name: 'L7a 設備', tone: 'b', verdict: '超越', summary: '設備廠營收與下季指引仍強。', group: 'chain' },
    { id: 'L7b', name: 'L7b 材料', tone: 'r', verdict: '偏離', summary: '漲價擴散仍在；本期沒有新增一手量測。', group: 'chain' },
    { id: 'L8', name: 'L8 電力', tone: 'r', verdict: '偏離', summary: '已宣布容量維持；許可問題尚未解除。', group: 'chain' },
    { id: 'rate', name: '外生｜利率', tone: 'g', verdict: '符合（貼上緣）', summary: '核心通膨與十年期公債接近上期所設上緣，尚未改判。', group: 'exo' },
    { id: 'reg', name: '外生｜管制', tone: 'r', verdict: '偏離（新）', summary: '遠端算力納管，屬新的可查核偏離。', group: 'exo' },
    { id: 'ref', name: '反射性迴路', tone: 'r', verdict: '偏離（惡化）', summary: '發債受阻成為一手事實；擁擠度明顯下降。', group: 'exo' }
  ],
  issueNotes: {
    '2026-W39': '以當時的 v1.0 判定，不回溯改判。',
    '2026-W40': '2026-11-06 回溯補寫，原未出刊。',
    '2026-W41': '回溯補寫。',
    '2026-W42': '材料列首度轉紅。',
    '2026-W43': '正式出刊，並公告尺的版本變更。',
    '2026-W44': '回溯補寫。',
    '2026-W45': '電力轉紅；新增兩項提案。',
    '2026-W46': '新增容忍區間失效提案。期間與上期有重疊。',
    '2026-W47': '當時判定尺為 v1.1；P0–P7 於 2026-11-19 核准後自下期起適用。'
  }
};
