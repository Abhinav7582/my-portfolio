import { motion } from "framer-motion"

const skills = [
{ category: "Languages", items: ["Python", "SQL", "PySpark", "HiveQL"] },
{ category: "Analytics & BI", items: ["Power BI", "Tableau", "Qlik Sense", "Mixpanel"] },
{ category: "Data & Engineering", items: ["Databricks", "Snowflake", "Microsoft Fabric", "Azure Data Factory", "Azure Cosmos DB"] },
{ category: "Libraries", items: ["pandas", "numpy", "scikit-learn", "matplotlib", "openpyxl", "pbixray"] },
{ category: "Domains", items: ["AdTech", "Product Analytics", "Marketing Analytics", "BI Automation", "Customer Analytics"] },
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
        I’m a Data Analyst with close to 3 years of experience across AdTech, product analytics,
        marketing analytics, business intelligence, and analytics automation. My work sits at the
        intersection of data, business problem solving, and stakeholder decision-making.
      </p>

      <p>
        I started with OCR and machine learning at Tata Insights & Quants, then moved into
        client-facing analytics at Affine Analytics, where I worked on recommendation systems,
        customer churn, pricing analysis, Power BI governance, and Microsoft MSN AdTech revenue
        diagnostics.
      </p>

      <p>
        Currently at MiQ, I focus on AdTech product analytics and automation. I build Databricks
        and PySpark workflows for DSP discrepancy monitoring, data stability checks, Sigma product
        feed migration, SLA reporting, and agentic documentation workflows.
      </p>

      <p>
        The consistent thread across my work is turning ambiguous, messy and manual processes
        into structured analytical systems that improve visibility, reduce effort, and help teams
        make faster decisions.
      </p>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {[
          { label: "Years of Experience", value: "~3" },
          { label: "Projects Delivered", value: "15+" },
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