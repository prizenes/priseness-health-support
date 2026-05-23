const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const contactForm = document.querySelector("[data-contact-form]");
const riskForm = document.querySelector("[data-risk-form]");
const riskResult = document.querySelector("[data-risk-result]");
const riskDetails = document.querySelector("#risk-details");
const riskOpenButtons = document.querySelectorAll("[data-open-risk-check]");

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
});

riskOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (riskDetails) {
      riskDetails.open = true;
    }
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const company = formData.get("company") || "未入力";
  const name = formData.get("name") || "未入力";
  const email = formData.get("email") || "未入力";
  const phone = formData.get("phone") || "未入力";
  const industry = formData.get("industry") || "未入力";
  const employees = formData.get("employees") || "未入力";
  const message = formData.get("message") || "";
  const body = [
    "プライズネス健康経営サポートについて相談したいです。",
    "",
    `会社名: ${company}`,
    `お名前: ${name}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone}`,
    `業種: ${industry}`,
    `従業員数: ${employees}`,
    "",
    "ご相談内容:",
    String(message),
  ].join("\n");

  window.location.href = `mailto:mail@prizenes.com?subject=${encodeURIComponent(
    "健康経営サポートの相談"
  )}&body=${encodeURIComponent(body)}`;
});

const categorySettings = {
  a: {
    title: "A. 腰痛・身体負担リスク",
    questions: [1, 2, 3, 4, 5, 6],
    high: 8,
    caution: 4,
    highMessage:
      "中腰・重量物・長時間同一姿勢などにより、腰痛や身体負担が蓄積しやすい職場環境の可能性があります。作業動作の確認、身体の使い方の指導、腰痛予防体操などの導入をおすすめします。",
  },
  b: {
    title: "B. 転倒・移動リスク",
    questions: [7, 8, 9, 10, 11],
    high: 7,
    caution: 3,
    highMessage:
      "床環境、段差、動線、急ぎ動作などにより、転倒リスクが高まっている可能性があります。職場環境の確認と、バランス機能・下肢筋力のチェックをおすすめします。",
  },
  c: {
    title: "C. 高年齢労働者・体力低下リスク",
    questions: [12, 13, 14, 15, 16],
    high: 7,
    caution: 3,
    highMessage:
      "従業員の高齢化や体力低下により、これまで問題なかった作業でも負担が大きくなっている可能性があります。年齢や身体機能に応じた作業調整、転倒・腰痛予防の取り組みが重要です。",
  },
  d: {
    title: "D. 健康管理・不調把握リスク",
    questions: [17, 18, 19, 20, 21],
    high: 7,
    caution: 3,
    highMessage:
      "従業員の不調や健康課題が見えにくく、痛み・体調不良・欠勤が発生してから対応する状態になっている可能性があります。早期相談体制や定期的な身体チェックの導入をおすすめします。",
  },
  e: {
    title: "E. 疲労・メンタル・働き方リスク",
    questions: [22, 23, 24, 25],
    high: 6,
    caution: 3,
    highMessage:
      "人手不足、休憩不足、疲労蓄積、ストレスなどが身体不調や労働災害の背景になっている可能性があります。作業負担の見直しと、従業員が相談しやすい体制づくりが重要です。",
  },
  f: {
    title: "F. 職場改善・健康経営体制リスク",
    questions: [26, 27, 28, 29, 30],
    high: 7,
    caution: 3,
    highMessage:
      "健康経営や労災予防に取り組む必要性は感じていても、課題把握や改善の仕組みが十分でない可能性があります。外部専門家による現状確認から始めることで、取り組むべき優先順位が明確になります。",
  },
};

const importantQuestions = [2, 5, 7, 8, 19, 22];

const riskQuestionTexts = {
  1: "中腰・前かがみ姿勢で行う作業が多い",
  2: "重い物を持つ、運ぶ、押す、引く作業がある",
  3: "ひねり動作や、無理な姿勢での作業がある",
  4: "長時間の立ち仕事、または長時間の座り仕事が多い",
  5: "腰痛・肩こり・膝痛などを訴える従業員がいる",
  6: "身体の使い方や作業姿勢について、専門的な指導を受けたことがない",
  7: "床が滑りやすい、または濡れやすい場所がある",
  8: "段差、コード、物品など、つまずきやすい場所がある",
  9: "通路が狭い、物が置かれている、動線が悪い場所がある",
  10: "階段や傾斜、暗い場所での移動がある",
  11: "急いで移動する、荷物を持って移動する場面が多い",
  12: "50代以上の従業員が増えている",
  13: "体力低下や疲れやすさを感じている従業員がいる",
  14: "視力低下、反応の遅れ、バランス低下が心配な従業員がいる",
  15: "年齢や体力に応じた作業量・休憩・配置の見直しが十分ではない",
  16: "転倒・腰痛・筋力低下に対する予防的な取り組みを行っていない",
  17: "健康診断後のフォローが十分にできていない",
  18: "痛みや体調不良を相談しやすい体制がない",
  19: "体調不良・痛み・ケガによる欠勤や休職がある",
  20: "従業員の運動不足や生活習慣の乱れが気になっている",
  21: "健康づくりの取り組みが単発で終わり、継続できていない",
  22: "人手不足により、一人あたりの身体的負担が大きい",
  23: "休憩が取りにくい、または休憩時間が不規則である",
  24: "疲労感、睡眠不足、集中力低下を訴える従業員がいる",
  25: "職場のストレスや人間関係が、体調不良に影響している可能性がある",
  26: "従業員の身体的な負担や不調を、会社として把握できていない",
  27: "腰痛・転倒・ケガ予防について、職場全体で学ぶ機会がない",
  28: "作業動作や職場環境を、外部専門家に見てもらったことがない",
  29: "健康経営に取り組みたいが、何から始めればよいかわからない",
  30: "健康づくりの担当者や、継続的に改善する仕組みがない",
};

const categoryMaxScores = {
  a: 12,
  b: 10,
  c: 10,
  d: 10,
  e: 8,
  f: 10,
};

function renderRiskQuestions() {
  const categoriesRoot = riskForm?.querySelector("[data-risk-categories]");
  if (!categoriesRoot || categoriesRoot.children.length > 0) return;

  categoriesRoot.innerHTML = Object.entries(categorySettings)
    .map(([key, category]) => {
      const questions = category.questions
        .map((questionNumber) => {
          const important = importantQuestions.includes(questionNumber) ? " important" : "";
          return `
            <div class="risk-question${important}">
              <span>${questionNumber}. ${riskQuestionTexts[questionNumber]}</span>
              <div class="score-options">
                <label><input type="radio" name="q${questionNumber}" value="0" checked />0</label>
                <label><input type="radio" name="q${questionNumber}" value="1" />1</label>
                <label><input type="radio" name="q${questionNumber}" value="2" />2</label>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <fieldset class="risk-category" data-category="${key}">
          <legend>${category.title} <small>${categoryMaxScores[key]}点満点</small></legend>
          <div class="risk-options">${questions}</div>
        </fieldset>
      `;
    })
    .join("");
}

renderRiskQuestions();

function getQuestionScore(questionNumber) {
  const selected = riskForm?.querySelector(`input[name="q${questionNumber}"]:checked`);
  return Number(selected?.value || 0);
}

function getOverallResult(total) {
  if (total >= 45) {
    return {
      label: "重点改善リスク",
      message:
        "複数の健康リスクが重なっている可能性があります。従業員の腰痛・転倒・欠勤・休職・離職につながる前に、職場環境、作業動作、身体機能、健康管理体制を総合的に見直すことが重要です。早期に専門家へ相談することをおすすめします。",
    };
  }

  if (total >= 30) {
    return {
      label: "高リスク",
      message:
        "従業員の身体不調、腰痛、転倒、疲労蓄積などのリスクが高まっている可能性があります。職場環境だけでなく、作業動作や従業員の身体機能も含めた総合的な確認が必要です。理学療法士による職場リスクチェックや健康セミナーの実施をおすすめします。",
    };
  }

  if (total >= 15) {
    return {
      label: "注意リスク",
      message:
        "腰痛・転倒・疲労・健康管理面で、潜在的な課題がある可能性があります。現時点では大きな問題になっていなくても、放置すると欠勤・休職・労災リスクにつながることがあります。職場環境や作業動作、従業員の身体機能を一度確認することをおすすめします。",
    };
  }

  return {
    label: "低リスク",
    message:
      "現在、大きな健康リスクは少ない状態と考えられます。ただし、従業員の高齢化や人手不足により、身体的負担は今後変化する可能性があります。定期的に職場環境や従業員の身体機能を確認することをおすすめします。",
  };
}

riskForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const categoryResults = Object.values(categorySettings).map((category) => {
    const score = category.questions.reduce(
      (sum, questionNumber) => sum + getQuestionScore(questionNumber),
      0
    );
    const level =
      score >= category.high ? "高い" : score >= category.caution ? "注意" : "低め";

    return { ...category, score, level };
  });

  const total = categoryResults.reduce((sum, category) => sum + category.score, 0);
  const overall = getOverallResult(total);
  const highCategories = categoryResults.filter((category) => category.level === "高い");
  const cautionItems = importantQuestions.filter(
    (questionNumber) => getQuestionScore(questionNumber) === 2
  );

  const categoryList = categoryResults
    .map(
      (category) =>
        `<li><strong>${category.title}</strong>：${category.score}点 / ${category.level}</li>`
    )
    .join("");
  const highMessages = highCategories
    .map((category) => `<p><strong>${category.title}</strong><br>${category.highMessage}</p>`)
    .join("");
  const cautionBlock = cautionItems.length
    ? `<div class="risk-alert"><strong>注意が必要な項目があります。</strong><p>合計点が低くても、腰痛・転倒・欠勤・人手不足に関する項目は、労災や休職につながる可能性があります。早めに職場環境や作業動作を確認することをおすすめします。</p></div>`
    : "";

  riskResult.innerHTML = `
    <h4>判定：${overall.label}</h4>
    <p><strong>合計点：${total}点 / 60点</strong></p>
    <p>${overall.message}</p>
    <ul>${categoryList}</ul>
    ${highMessages}
    ${cautionBlock}
    <div class="risk-cta">
      <strong>職場の健康リスクが気になる企業様へ</strong>
      <p>プライズネス健康経営サポートでは、理学療法士が職場を訪問し、従業員の身体機能・作業動作・職場環境を確認します。腰痛・転倒・ケガの予防に向けて、現場に合わせた改善提案を行います。</p>
      <a class="button button-primary" href="/#contact">無料相談はこちら</a>
    </div>
  `;
});
