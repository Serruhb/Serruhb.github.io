import React from "react";
import "./styles.css"; // optional: see styles below

const AiAutomationPage = () => {
  return (
    <div className="page">
      {/* HERO */}
      <header className="hero">
        <h1>AI &amp; Automation Project</h1>
        <p>Transforming workflows with intelligent automation.</p>
      </header>

      {/* PROBLEM / SOLUTION */}
      <section className="section">
        <h2>The Problem</h2>
        <p>
          Manual processes introduce delays, inconsistencies, and unnecessary
          workload.
        </p>

        <h2>Our Solution</h2>
        <p>
          This AI automation engine optimizes decision-making by analyzing data
          in real time and triggering smart, automated workflows.
        </p>
      </section>

      {/* FEATURES */}
      <section className="section">
        <h2>Key Features</h2>
        <div className="grid grid-features">
          <div className="card">
            <h3>Real-time AI Decisions</h3>
            <p>Processes data instantly to provide rapid insights.</p>
          </div>
          <div className="card">
            <h3>Workflow Automation</h3>
            <p>Eliminates repetitive manual tasks through rule-based automation.</p>
          </div>
          <div className="card">
            <h3>Predictive Insights</h3>
            <p>Uses machine learning to forecast trends and optimize operations.</p>
          </div>
          <div className="card">
            <h3>Monitoring Dashboard</h3>
            <p>Visualizes key performance metrics and system activity.</p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE OVERVIEW */}
      <section className="section">
        <h2>System Architecture</h2>
        <p>A simple diagram or illustration could be placed here.</p>
        <ul className="architecture-list">
          <li>Data Sources →</li>
          <li>AI Processing Engine →</li>
          <li>Automation Logic →</li>
          <li>Dashboard &amp; Reports</li>
        </ul>
      </section>

      {/* METRICS */}
      <section className="section">
        <h2>Impact &amp; Results</h2>
        <div className="metrics">
          <div className="metric">
            <h3>85%</h3>
            <p>Less manual work</p>
          </div>
          <div className="metric">
            <h3>97%</h3>
            <p>Accuracy improvement</p>
          </div>
          <div className="metric">
            <h3>12 sec</h3>
            <p>Processing time</p>
          </div>
          <div className="metric">
            <h3>400+ hrs</h3>
            <p>Saved monthly</p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section">
        <h2>Use Cases</h2>
        <div className="grid grid-usecases">
          <div className="card">
            <h3>Fraud Detection</h3>
            <p>Detects anomalies in real time with AI models.</p>
          </div>
          <div className="card">
            <h3>Email Classification</h3>
            <p>Automatically routes messages to the right workflows.</p>
          </div>
          <div className="card">
            <h3>Predictive Maintenance</h3>
            <p>Anticipates hardware failures before they occur.</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section">
        <h2>Get in Touch</h2>
        <p>Interested in learning more or using this system? Contact us for a demo.</p>
      </section>

      <footer className="footer">
        <p>© 2025 AI &amp; Automation Project Demo</p>
      </footer>
    </div>
  );
};

export default AiAutomationPage;
