const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const contactForm = document.querySelector("[data-contact-form]");
const riskForm = document.querySelector("[data-risk-form]");
const riskResult = document.querySelector("[data-risk-result]");
const lowBackForm = document.querySelector("[data-low-back-form]");
const lowBackResult = document.querySelector("[data-low-back-result]");
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
      <a class="button button-primary" href="/contact">無料相談はこちら</a>
    </div>
  `;
});

const lowBackCategories = {
  posture: {
    title: "A. 作業姿勢・動作リスク",
    max: 20,
    high: 11,
    questions: [
      "前かがみ・中腰姿勢で作業することが多い",
      "腰をひねりながら作業することが多い",
      "重い物を持ち上げる・運ぶ作業がある",
      "急に物を持ち上げる、急いで作業する場面が多い",
      "物を身体から離れた位置で持つことが多い",
      "長時間立ちっぱなしの作業が多い",
      "長時間座りっぱなしの作業が多い",
      "同じ動作を繰り返す作業が多い",
      "人を支える、抱える、介助する作業がある",
      "階段や段差を荷物を持って移動することがある",
    ],
    comment:
      "前かがみ、中腰、ひねり、重量物の取り扱いなど、腰部に負担がかかりやすい作業が多い可能性があります。作業姿勢、作業手順、持ち上げ動作の見直しが必要です。",
  },
  environment: {
    title: "B. 作業環境リスク",
    max: 14,
    high: 8,
    questions: [
      "作業台や机の高さが身体に合っていない",
      "作業スペースが狭く、無理な姿勢になりやすい",
      "荷物や道具の配置が悪く、かがむ・伸ばす動作が多い",
      "床に段差、凹凸、滑りやすい場所がある",
      "足元や通路が暗く、見えにくい場所がある",
      "寒い場所、冷える場所で作業することがある",
      "車両運転や機械操作など、振動を受ける作業がある",
    ],
    comment:
      "作業台の高さ、作業スペース、床環境、照明、温度、振動など、職場環境が腰痛リスクに影響している可能性があります。作業環境の調整や整理整頓、動線の見直しが必要です。",
  },
  body: {
    title: "C. 身体機能・健康リスク",
    max: 16,
    high: 9,
    questions: [
      "最近、腰痛や臀部・脚のしびれを感じることがある",
      "過去に腰痛で仕事や日常生活に支障が出たことがある",
      "腹筋・背筋・下肢筋力の低下を感じる",
      "身体が硬く、前屈やしゃがみ込みがしづらい",
      "片脚立ちやバランスに不安がある",
      "運動習慣が少ない",
      "体重増加や体力低下を感じる",
      "睡眠不足や疲労が抜けにくい状態が続いている",
    ],
    comment:
      "筋力、柔軟性、バランス、運動習慣、疲労状態など、個人の身体機能や健康状態に腰痛リスクがみられる可能性があります。理学療法士による身体機能チェックや個別運動指導が有効です。",
  },
  system: {
    title: "D. 心理社会的・職場体制リスク",
    max: 10,
    high: 6,
    questions: [
      "忙しく、十分な休憩や小休止が取りにくい",
      "腰痛があっても相談しにくい雰囲気がある",
      "人員不足で無理な作業を一人で行うことがある",
      "腰痛予防や正しい作業姿勢の教育を受けていない",
      "職場のストレスや対人関係の負担が大きい",
    ],
    comment:
      "休憩の取りにくさ、人員不足、相談しにくい雰囲気、教育不足、職場ストレスなどが腰痛リスクに関係している可能性があります。職場全体での予防体制づくりが重要です。",
  },
};

function renderLowBackQuestions() {
  const categoriesRoot = lowBackForm?.querySelector("[data-low-back-categories]");
  if (!categoriesRoot || categoriesRoot.children.length > 0) return;

  let questionNumber = 1;
  categoriesRoot.innerHTML = Object.entries(lowBackCategories)
    .map(([key, category]) => {
      const questions = category.questions
        .map((question) => {
          const currentNumber = questionNumber++;
          return `
            <div class="risk-question low-back-question">
              <span>${currentNumber}. ${question}</span>
              <div class="score-options low-back-options">
                <label><input type="radio" name="lb${currentNumber}" value="0" />0点<span>ほとんどない</span></label>
                <label><input type="radio" name="lb${currentNumber}" value="1" />1点<span>時々ある</span></label>
                <label><input type="radio" name="lb${currentNumber}" value="2" />2点<span>よくある</span></label>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <fieldset class="risk-category" data-low-back-category="${key}">
          <legend>${category.title} <small>${category.max}点満点</small></legend>
          <div class="risk-options">${questions}</div>
        </fieldset>
      `;
    })
    .join("");
}

function getLowBackOverall(total) {
  if (total >= 45) {
    return {
      label: "最優先リスク",
      message:
        "早急な対策が必要な状態です。腰痛が発生しやすい作業条件が重なっている可能性があります。職場環境の改善、作業方法の見直し、身体機能チェック、個別または小集団での運動指導を組み合わせた対策が必要です。",
    };
  }
  if (total >= 30) {
    return {
      label: "高リスク",
      message:
        "職場の腰痛リスクが高い状態です。作業姿勢・作業環境・身体機能・職場体制のいずれか、または複数に課題がある可能性があります。腰痛による休業、作業効率低下、労災リスクの低減に向けて、専門家による職場評価と運動指導をおすすめします。",
    };
  }
  if (total >= 15) {
    return {
      label: "中等度リスク",
      message:
        "腰痛につながる要因が複数みられます。前かがみ作業、長時間同一姿勢、休憩不足、身体機能低下などが重なると、慢性的な腰痛や作業効率の低下につながる可能性があります。職場環境の見直しと、従業員への腰痛予防指導を検討しましょう。",
    };
  }
  return {
    label: "低リスク",
    message:
      "現時点では、職場の腰痛リスクは比較的低い状態です。ただし、腰痛は作業内容、体力、疲労、年齢、職場環境の変化によってリスクが高まることがあります。定期的なチェックと、作業姿勢・運動習慣の見直しをおすすめします。",
  };
}

function getLowBackScore(questionNumber) {
  const selected = lowBackForm?.querySelector(`input[name="lb${questionNumber}"]:checked`);
  return selected ? Number(selected.value) : null;
}

renderLowBackQuestions();

lowBackForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const unanswered = [];
  for (let i = 1; i <= 30; i += 1) {
    if (getLowBackScore(i) === null) unanswered.push(i);
  }

  if (unanswered.length > 0) {
    lowBackResult.innerHTML = `
      <h4>未回答の項目があります</h4>
      <p>${unanswered.length}項目が未回答です。すべての項目に回答してから、もう一度判定してください。</p>
      <p><strong>未回答：</strong>${unanswered.join("、")}</p>
    `;
    lowBackResult.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  let questionNumber = 1;
  const categoryResults = Object.values(lowBackCategories).map((category) => {
    const score = category.questions.reduce((sum) => {
      const value = getLowBackScore(questionNumber);
      questionNumber += 1;
      return sum + Number(value);
    }, 0);
    return {
      ...category,
      score,
      level: score >= category.high ? "高め" : score >= Math.ceil(category.high / 2) ? "注意" : "低め",
    };
  });

  const total = categoryResults.reduce((sum, category) => sum + category.score, 0);
  const overall = getLowBackOverall(total);
  const categoryList = categoryResults
    .map((category) => `<li><strong>${category.title}</strong>：${category.score}点 / ${category.max}点（${category.level}）</li>`)
    .join("");
  const categoryComments = categoryResults
    .filter((category) => category.level === "高め")
    .map((category) => `<p><strong>${category.title}</strong><br>${category.comment}</p>`)
    .join("");

  lowBackResult.innerHTML = `
    <h4>総合判定：${overall.label}</h4>
    <p><strong>総合リスク：${total}点 / 60点満点</strong></p>
    <p>${overall.message}</p>
    <ul>${categoryList}</ul>
    ${categoryComments || "<p>カテゴリ別に極端に高い項目はありませんが、点数がある項目は職場の状況に合わせて確認をおすすめします。</p>"}
    <div class="risk-cta">
      <strong>腰痛リスクが気になる企業様へ</strong>
      <p>リハビリジムプライズネスでは、理学療法士が職場の腰痛・転倒リスクを確認し、従業員の身体機能チェック、作業姿勢の見直し、職場でできる運動指導を行います。</p>
      <p>60歳以上の労働者がいる企業では、エイジフレンドリー補助金を活用できる可能性があります。まずは、職場の状況を整理し、必要な対策を一緒に考えていきましょう。</p>
      <a class="button button-primary" href="/contact">企業向け腰痛予防について相談する</a>
    </div>
  `;
  lowBackResult.scrollIntoView({ behavior: "smooth", block: "center" });
});
