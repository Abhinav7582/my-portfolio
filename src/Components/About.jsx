import { motion } from "framer-motion"

const skills = [
  { category: "Languages & Processing", items: ["Python", "SQL", "PySpark", "Apache Spark", "Apache Hive"] },
  { category: "Data Engineering & Platforms", items: ["Databricks", "Snowflake", "dbt", "Azure Data Factory", "Azure Synapse", "Azure Data Lake", "Azure Cosmos DB", "AWS S3", "Google BigQuery", "MySQL"] },
  { category: "Data Science & ML", items: ["scikit-learn", "XGBoost", "Logistic Regression", "Classification", "Predictive & Statistical Modeling", "Feature Engineering", "NLP", "Customer Segmentation", "Quasi-Experimental Design"] },
  { category: "Visualization & BI", items: ["Power BI", "Tableau", "Mixpanel", "Data Visualization"] },
  { category: "Engineering Practices", items: ["ETL/ELT", "Data Modeling", "Workflow Automation", "EDA", "Git/Bitbucket"] },
  { category: "AI Tooling & Domains", items: ["Cursor", "MCP", "AI-Assisted Analytics", "AdTech", "Product Analytics", "Marketing Analytics", "Customer Analytics"] },
]

function About() {
return ( <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
<motion.div
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
className="text-center mb-16"
> <p className="text-blue-400 text-sm tracking-widest uppercase mb-3">Who I Am</p> <h2 className="text-4xl font-bold text-white">About Me</h2>
</motion.div>
  <div className="grid md:grid-cols-2 gap-12 items-start">
    {/* Left: Story */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-4 text-gray-400 leading-relaxed"
    >
      <p>
        I'm a Data Analyst with 3+ years of experience across AdTech, product analytics, 
        marketing analytics, business intelligence and data engineering. My work sits at the intersection 
        of data, business problem solving, and stakeholder decision-making.
      </p>

      <p>
        I started with OCR and machine learning at Tata Insights & Quants, then moved into client-facing analytics at Affine Analytics. 
        There I built recommendation systems on TF-IDF product features, segment-level churn models in Snowflake benchmarking logistic regression 
        against XGBoost, quasi-experimental pricing studies that recovered six figures in revenue, Power BI metadata governance across a 
        6,000 dashboard estate and revenue diagnostics for the Microsoft MSN Bing Ads marketplace.
      </p>

      <p>
        Currently at MiQ, I focus on AdTech product analytics and automation. I build Databricks and PySpark pipelines for 
        DSP discrepancy monitoring, data stability checks, and API based ingestion across seven platforms, 
        alongside the Sigma browsing feed migration and AI assisted documentation workflows using Cursor and MCP.
      </p>

      <p>
        The consistent thread across my work is turning ambiguous, messy and manual processes 
        into structured analytical systems that improve visibility, reduce effort, and help teams make faster decisions.
      </p>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {[
          { label: "Years of Experience", value: "3+" },
          { label: "Enterprise Clients", value: "4+" },
          { label: "Research Publication", value: "1" },
          { label: "Based In", value: "Bengaluru 🇮🇳" },
        ].map((fact, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-400">{fact.value}</p>
            <p className="text-gray-500 text-sm mt-1">{fact.label}</p>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Right: Skills */}
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {skills.map((group, i) => (
        <div key={i}>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{group.category}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((skill, j) => (
              <span
                key={j}
                className="bg-gray-900 border border-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-full hover:border-blue-600/50 hover:text-blue-400 transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  </div>
</section>
)
}

export default About