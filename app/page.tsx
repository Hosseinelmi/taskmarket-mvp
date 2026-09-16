"use client";

import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  function analyzeTask() {
    if (!task.trim()) {
      alert("لطفاً ابتدا درخواست خود را بنویسید.");
      return;
    }

    const text = task.toLowerCase();

    let category = "خدمات";
    let skill = "متخصص عمومی";
    let mode = "نیاز به بررسی";
    let urgency = "عادی";

    if (
      text.includes("لپ") ||
      text.includes("کامپیوتر") ||
      text.includes("پرینتر") ||
      text.includes("ویندوز") ||
      text.includes("شبکه")
    ) {
      category = "IT";
      skill = "تعمیر و پشتیبانی IT";
      mode = "حضوری / آنلاین";
    } else if (
      text.includes("سشوار") ||
      text.includes("جارو") ||
      text.includes("اتو") ||
      text.includes("پنکه") ||
      text.includes("تعمیر")
    ) {
      category = "تعمیرات";
      skill = "تعمیرکار لوازم برقی";
      mode = "حضوری";
    } else if (
      text.includes("اکسل") ||
      text.includes("power bi") ||
      text.includes("پاور بی آی") ||
      text.includes("ترجمه") ||
      text.includes("تحقیق")
    ) {
      category = "دانش و تخصص";
      skill = "متخصص Excel / Power BI / Research";
      mode = "آنلاین";
    }

    if (
      text.includes("فوری") ||
      text.includes("الان") ||
      text.includes("امروز")
    ) {
      urgency = "زیاد";
    } else if (text.includes("فردا")) {
      urgency = "بالا";
    }

    setResult({
      category,
      skill,
      mode,
      urgency,
    });

    setSaved(false);
  }

  async function saveTask() {
    if (!result) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: task,
          category: result.category,
          skill: result.skill,
          urgency: result.urgency,
          serviceMode: result.mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ثبت درخواست");
      }

      setSaved(true);

      alert(
        "درخواست شما با موفقیت ثبت شد.\nکد درخواست: " +
          data.taskCode
      );
    } catch (error: any) {
      alert(error.message || "خطایی رخ داد.");
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Tahoma, Arial, sans-serif",
        color: "#172033",
      }}
    >
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          style={{
            fontSize: 24,
            color: "#2563eb",
          }}
        >
          Task<span style={{ color: "#111827" }}>Market</span>
        </strong>

        <button
          onClick={() =>
            document
              .getElementById("task-box")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          style={buttonStyle}
        >
          ثبت درخواست
        </button>
      </header>

      <section
        style={{
          padding: "70px 5% 50px",
          textAlign: "center",
          background:
            "linear-gradient(135deg,#eff6ff,#ffffff)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(35px,6vw,58px)",
            marginBottom: 15,
          }}
        >
          هر کاری داری،{" "}
          <span style={{ color: "#2563eb" }}>
            فقط بگو.
          </span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#64748b",
            marginBottom: 30,
          }}
        >
          ما آدم مناسب انجام کار را برایت پیدا می‌کنیم.
        </p>

        <div
          id="task-box"
          style={{
            maxWidth: 780,
            margin: "auto",
            background: "#fff",
            padding: 20,
            borderRadius: 18,
            boxShadow:
              "0 15px 45px rgba(15,23,42,.10)",
          }}
        >
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="مشکلت یا کاری که می‌خواهی انجام شود را به زبان خودت بنویس...
مثلاً: سشوارم خراب شده و می‌خوام با هزینه مناسب تعمیرش کنم."
            style={{
              width: "100%",
              minHeight: 140,
              border: "none",
              outline: "none",
              resize: "vertical",
              fontSize: 17,
              padding: 10,
              fontFamily: "inherit",
            }}
          />

          <button
            onClick={analyzeTask}
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: 15,
              fontSize: 16,
            }}
          >
            🤖 پیدا کردن متخصص
          </button>

          {result && (
            <div
              style={{
                marginTop: 25,
                background: "#f8fafc",
                padding: 20,
                borderRadius: 15,
                textAlign: "right",
              }}
            >
              <h3>تحلیل درخواست</h3>

              <div style={gridStyle}>
                <Info
                  title="دسته‌بندی"
                  value={result.category}
                />
                <Info
                  title="مهارت"
                  value={result.skill}
                />
                <Info
                  title="فوریت"
                  value={result.urgency}
                />
                <Info
                  title="نوع خدمت"
                  value={result.mode}
                />
              </div>

              <button
                onClick={saveTask}
                style={{
                  ...buttonStyle,
                  marginTop: 20,
                  width: "100%",
                }}
              >
                {saved
                  ? "✓ درخواست ثبت شد"
                  : "ثبت واقعی درخواست"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        style={{
          padding: "50px 5%",
          maxWidth: 1100,
          margin: "auto",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          TaskMarket چطور کار می‌کند؟
        </h2>

        <div style={gridStyle}>
          <Info
            title="💬 فقط توضیح بده"
            value="نیازی نیست اسم دقیق خدمت را بدانی."
          />

          <Info
            title="🤖 هوش مصنوعی"
            value="درخواست تو را تحلیل و ساختاربندی می‌کند."
          />

          <Info
            title="👨‍🔧 متخصص"
            value="متخصص مناسب درخواستت را دریافت می‌کند."
          />
        </div>
      </section>
    </main>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 14,
        border: "1px solid #e5e7eb",
      }}
    >
      <strong>{title}</strong>
      <p style={{ color: "#64748b" }}>{value}</p>
    </div>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 15,
  marginTop: 20,
};
