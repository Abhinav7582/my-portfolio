export const projects = [
  {
    id: 1,
    title: "Agentic EDA & Documentation Platform",
    company: "MiQ",
    oneliner:
      "Building an agentic AI system that automates exploratory analysis and project documentation for analysts across Unity Catalog data sources",
    stats: [
      { label: "Documentation Time", value: "Days → Mins" },
      { label: "Analysis Effort Reduced", value: "~50%" },
    ],
    summary:
      "An initiative to bring agentic AI into the day to day analyst workflow at MiQ by automating two of the most repetitive parts of analytics work: exploratory analysis and documentation. The platform helps analysts pull context from project tickets, notebooks, code, and analysis files, then convert that context into structured documentation and reusable EDA outputs.",
    details: [
      "Built the first phase as a documentation agent inside Cursor using Claude and MCP connectors for Atlassian, Jira, Confluence, Bitbucket, Databricks, and Google Docs",
      "Designed the workflow to automatically pull context from Jira tickets, Bitbucket code, Databricks notebooks, and Google Docs analysis files",
      "Generated structured project documentation covering the business problem, task, approach, code references, analysis, validation, and results",
      "Engineered prompts to match internal documentation standards so the output stayed consistent, reviewable, and useful for analysts",
      "Extended the same foundation into an EDA agent that can work directly with Unity Catalog data sources",
      "Standardized recurring checks such as deduplication logic, schema documentation, table profiling, null checks, and freshness checks that previously had to be rewritten for every dataset",
    ],
    impact:
      "Reduced project documentation time from multiple days to roughly 30 to 45 minutes including human validation, while keeping sensitive information inside the Cursor environment. The standardized EDA layer reduced repeat analysis effort by approximately 50% and lowered each team's dependency on tribal knowledge.",
    tags: [
      "Cursor",
      "Claude",
      "MCP",
      "Databricks",
      "Unity Catalog",
      "PySpark",
      "Prompt Engineering",
      "Automation",
    ],
  },
  {
    id: 2,
    title: "DSP Discrepancy & Data Stability Pipeline",
    company: "MiQ",
    oneliner:
      "Automated discrepancy monitoring and data freshness tracking across Tier 1 DSPs, with daily executive reporting delivered directly to Slack",
    stats: [
      { label: "Compute Savings", value: "~$10K" },
      { label: "DSPs Monitored", value: "Tier 1" },
    ],
    summary:
      "A pipeline that catches data quality issues across Tier 1 DSPs before they reach reporting. Instead of analysts manually checking whether DSP reported numbers match internal records, the system compares them daily, flags the largest discrepancies, tracks how long each platform takes to stabilize, and posts a clean executive summary to Slack.",
    details: [
      "Compared DSP reported data against standardized internal tables across DV360, The Trade Desk, Yahoo, and Amazon",
      "Calculated metric level differences and generated trend charts and bucket distributions to show where discrepancies were clustering",
      "Identified the specific dates with the largest discrepancies so analysts knew exactly where to investigate first",
      "Added data freshness monitoring to understand how long each DSP takes to stabilize its reported numbers before teams can fully trust the figures",
      "Updated Yahoo validation from line item level to campaign level logic so discrepancy checks matched the correct business reporting grain",
      "Posted concise executive summaries to Slack automatically, enabling daily KPI monitoring without requiring analysts to open a notebook",
      "Designed the workflow to be reusable and scalable, creating a foundation for ongoing AdTech data quality and data freshness monitoring",
    ],
    impact:
      "Eliminated repetitive manual discrepancy checks and improved trust in reported numbers across Tier 1 DSPs. The pipeline helped teams detect high impact mismatches earlier, distinguish true tracking issues from data freshness delays, and contributed roughly $10K in compute optimization savings through more efficient automation.",
    tags: [
      "Python",
      "PySpark",
      "SQL",
      "Databricks",
      "Slack API",
      "AdTech",
      "Data Quality",
      "Automation",
    ],
  },
  {
    id: 3,
    title: "Sigma Browsing Feed Migration",
    company: "MiQ",
    oneliner:
      "Led the migration of MiQ Sigma's browsing feed from deprecated Xandr data to Index Exchange before source deprecation could disrupt the live product",
    stats: [
      { label: "Countries Standardized", value: "11" },
      { label: "Regions Covered", value: "US · APAC · EMEA" },
    ],
    summary:
      "MiQ Sigma's browsing feed depended on Xandr, which was being deprecated. I led a proactive migration to Index Exchange by analyzing the new source, rebuilding the transformation logic, validating regional coverage, and productionizing a weekly pipeline so the live product continued running without interruption.",
    details: [
      "Ran detailed EDA on Index Exchange data across US, APAC, and EMEA to understand how the new source behaved compared with the old Xandr feed",
      "Validated schema, available dimensions, content fields, geography fields, browser and device attributes, country coverage, and regional data availability before production use",
      "Built the transformation pipeline in PySpark on Databricks to convert raw Index Exchange data into a structured Sigma ready feed",
      "Implemented IAB taxonomy mapping for content classification and ISO based geo resolution for geography standardization",
      "Added peak hour detection and daypart windowing so the feed captured time based browsing behavior, not just raw events",
      "Standardized output across 11 countries by handling differences in data volume, country codes, time zones, and category coverage",
      "Validated row counts, schema consistency, null rates, coverage, taxonomy mapping, geo mapping, and time based aggregations to ensure the new feed was business ready",
      "Productionized the workflow to run weekly, turning the migration into a reliable recurring pipeline rather than a one time replacement",
    ],
    impact:
      "Ensured business continuity by replacing the deprecated Xandr dependency before it could disrupt Sigma. The project onboarded Index Exchange as a reliable new data partner, established a consistent multi region framework across 11 countries, and made the feed more analytically useful through taxonomy, geography, and time based enrichment.",
    tags: [
      "PySpark",
      "Databricks",
      "Python",
      "SQL",
      "IAB Taxonomy",
      "Sigma",
      "Data Pipeline",
      "Product Analytics",
    ],
  },
  {
    id: 4,
    title: "Microsoft MSN AdTech Revenue Diagnostics",
    company: "Affine Analytics · Microsoft MSN",
    oneliner:
      "Built monetization reporting and revenue diagnostics across Microsoft MSN's ad ecosystem, helping teams explain performance movement across markets, page types, ad formats, and partners",
    stats: [
      { label: "Revenue Movement Analyzed", value: ">$4M" },
      { label: "PBIX Size Reduced", value: "4.8GB → <1GB" },
    ],
    summary:
      "A monetization analytics and reporting project for Microsoft MSN focused on understanding why ad revenue moved across regions, page types, ad formats, experiences, and monetization partners. The work combined SQL reporting logic, Power BI dashboards, SSP partner diagnostics, experience segmentation, migration validation, and stakeholder commentary so teams could move from basic performance tracking to faster root cause analysis.",
    details: [
      "Built and enhanced RSMS reporting to decompose revenue movement into rate, volume, mix, geography, experience, page type, and partner level drivers",
      "Developed the Top Contributors dashboard to rank the largest positive and negative revenue drivers across markets, page types, ad formats, and bidders including MSAN, Xandr, Amazon Ads, Index Exchange, GSET, and others",
      "Supported migration analytics for 20+ third party monetization partners into Xandr based reporting, reconciling Xandr Monetize UI outputs with log level data to validate impression consistency, revenue parity, and reporting continuity",
      "Refined Ruby versus Classic experience segmentation by identifying cases where placement identifiers did not always map cleanly to Canvas or OCID values",
      "Revalidated revenue and impression shares after classification changes to ensure experience level reporting stayed accurate",
      "Ran page mix shift analysis that isolated more than $0.64M of value transfer across US, T7 ex US, and ROW, driven by traffic movement across page types",
      "Optimized large Power BI reporting models by reducing PBIX size from around 4.8GB to under 1GB across phases, improving refresh stability and stakeholder usability",
      "Built unmapped publisher alerting triggered above roughly 0.5% revenue share to surface mapping and data quality gaps before they reached stakeholder reporting",
      "Automated recurring SSP monetization and revenue tracking workflows, reducing manual reporting effort and improving placement level revenue visibility",
      "Authored stakeholder ready commentary connecting metric movement to business drivers, such as Watch RPM weakness from Xandr and GSET or offsets from Native NTP and Article performance",
    ],
    impact:
      "Improved Microsoft MSN's ability to diagnose revenue movement across US, T7 ex US, and ROW markets by connecting performance changes to impressions, RPM, page mix, experience, ad format, and partner behavior. The project helped teams identify more than $4M in revenue movement, validate 20+ partner migrations into Xandr reporting, reduce Power BI model size from 4.8GB to under 1GB, and improve stakeholder trust through better classification, alerting, and root cause visibility.",
    tags: [
      "Power BI",
      "SQL",
      "AdTech",
      "SSP Analytics",
      "Revenue Diagnostics",
      "RPM Analysis",
      "Xandr Monetize",
      "Partner Migration",
      "Data Validation",
      "Dashboard Automation",
    ],
  },
  {
    id: 5,
    title: "Product Recommendation Engine",
    company: "Affine Analytics · Blue Nile",
    oneliner:
      "Built a behavior driven personalization engine using browsed and purchased SKUs, price buckets, and product similarity to improve recommendation relevance",
    stats: [
      { label: "Accuracy Improvement", value: "+40%" },
      { label: "Sales Conversion Lift", value: "+10%" },
    ],
    summary:
      "A personalization engine for Blue Nile that was built after analyzing customer behavior through Customer 360 and Monthly Browsing dashboards. Those dashboards helped identify how customers browsed, compared, and purchased products across categories and price ranges. The recommendation model then used browsed and purchased product SKUs along with the pricing buckets those products belonged to, creating a more practical recommendation framework for a high consideration jewelry purchase journey.",
    details: [
      "Used insights from Customer 360 and browsing analytics to understand customer purchase behavior, product affinity, browsing intent, and price sensitivity before building the recommendation logic",
      "Built the recommendation framework around product SKUs that customers had purchased or browsed, so recommendations were grounded in actual customer behavior",
      "Created pricing bucket logic for products so the model could recommend items that were not only similar but also commercially relevant to the customer's observed price range",
      "Structured the cosine similarity approach around two vector representations, using customer product behavior and product pricing/category signals to identify relevant recommendations",
      "Compared LightFM with a cosine similarity based approach to evaluate which method produced more relevant outputs for the business use case",
      "Selected cosine similarity after validation because it produced more explainable and business relevant recommendations for the available data",
      "Applied business filters to remove already purchased products and refine suggestions using category and price tier logic",
      "Manually reviewed recommendation outputs for business relevance by checking category fit, browsing intent alignment, and reasonable price range",
      "Refined the recommendation logic iteratively based on validation, reducing irrelevant suggestions over successive passes",
    ],
    impact:
      "Improved recommendation accuracy by approximately 40% and contributed to a roughly 10% lift in sales conversions through better personalization and product discovery. The project connected dashboard driven customer behavior analysis with a practical recommendation model, helping the business recommend products based on what customers actually browsed or purchased and the price ranges they showed interest in. This improved cross sell and upsell relevance while keeping recommendations explainable for stakeholders.",
    tags: [
      "Python",
      "Machine Learning",
      "Cosine Similarity",
      "LightFM",
      "Recommender Systems",
      "Customer Analytics",
      "Retail Analytics",
      "Personalization",
    ],
  },
  {
    id: 6,
    title: "Customer 360 & Browsing Analytics",
    company: "Affine Analytics · Blue Nile",
    oneliner:
      "Built customer level dashboards and reusable analytics layers that mapped browsing, sales, returns, product behavior, and price sensitivity into a unified customer view",
    stats: [
      { label: "Manual Effort Reduced", value: "~70%" },
      { label: "Conversion Improvement", value: "+12%" },
    ],
    summary:
      "A customer analytics and BI initiative for Blue Nile focused on understanding how customers browsed, compared, and purchased jewelry products. The dashboards and reusable data layers brought together browsing behavior, sales, orders, returns, product SKUs, category preferences, discount behavior, and pricing buckets, creating the customer level foundation that later supported segmentation, retargeting, and the product recommendation engine.",
    details: [
      "Built the Customer 360 Dashboard by consolidating sales, orders, returns, browsing behavior, category preferences, lifetime revenue, AOV, order recency, and customer value indicators",
      "Created the Customer Attributes Table as a reusable customer level layer that powered dashboards, segmentation, recurring analysis workflows, and the later recommendation engine",
      "Built the Customer Monthly Browsing Dashboard to track engagement trends, identify high intent browsers, and surface users who had strong browsing behavior but had not yet purchased",
      "Analyzed purchased and browsed product SKUs to understand product affinity, browsing depth, repeat interest, and category level intent",
      "Created pricing bucket logic to understand the price ranges customers were browsing or purchasing from, which later became an important input for recommendation relevance",
      "Analyzed product level browsing patterns, keyword trends, category interest, and customer search behavior to support marketing and retargeting decisions",
      "Created discount behavior KPIs to identify discount sensitive customers and help marketing teams design more targeted promotional strategies",
      "Improved funnel visibility by connecting browsing and purchasing data, allowing teams to understand where customers were engaging, dropping off, or moving toward purchase",
      "Performed SQL validation and manual QC across joins, aggregations, duplicates, null handling, metric definitions, and dashboard outputs before stakeholder delivery",
    ],
    impact:
      "Reduced recurring manual analysis effort by approximately 70% by creating reusable customer level dashboards and data layers. The work improved customer targeting, lifecycle visibility, and funnel level understanding, while also creating the behavioral foundation for the recommendation engine. By connecting SKU level browsing and purchase behavior with pricing buckets, the dashboards helped translate customer behavior into model ready features and more actionable marketing insights.",
    tags: [
      "SQL",
      "Tableau",
      "Customer Analytics",
      "Customer 360",
      "Browsing Analytics",
      "SKU Analysis",
      "Pricing Buckets",
      "Segmentation",
      "E-commerce Analytics",
      "Data Validation",
    ],
  },
  {
    id: 7,
    title: "Power BI Metadata Extraction & Governance POC",
    company: "Affine Analytics · DuPont",
    oneliner:
      "Automated extraction and comparison of Power BI dashboard metadata at enterprise scale, converting the POC into a project engagement worth approximately $45K",
    stats: [
      { label: "Project Conversion", value: "~$45K" },
      { label: "Dashboard Estate", value: "6,000+" },
    ],
    summary:
      "A BI governance and automation POC for DuPont that answered a costly enterprise question: what is actually inside thousands of Power BI dashboards without manually opening every PBIX file? The solution extracted dashboard metadata automatically and compared reports, turning manual PBIX inspection into a structured, reviewable output.",
    details: [
      "Addressed the challenge of manually reviewing PBIX files, where each report could contain complex data models, tables, Power Query steps, DAX measures, relationships, pages, filters, and visuals",
      "Built Python parsing logic using pbixray to inspect PBIX file structure and extract model level metadata",
      "Parsed Power BI report layout JSON to capture visual level details such as pages, visuals, filters, and layout structure",
      "Extracted a complete metadata view covering tables, columns, data types, Power Query transformations, DAX tables, DAX measures, relationships, and report visuals",
      "Built comparison logic between two PBIX files to surface differences in tables, measures, relationships, visuals, and transformation logic",
      "Used the comparison output to support duplicate dashboard detection, version comparison, migration validation, and dashboard consolidation analysis",
      "Delivered the output as a structured multi sheet Excel workbook, with separate sheets for each metadata category so stakeholders did not need to read raw JSON or manually inspect PBIX files",
    ],
    impact:
      "The POC demonstrated enough business and technical value to convert into a formal engagement worth approximately $45K. It created a reusable framework applicable across DuPont's 6,000+ dashboard estate, improving BI governance, dashboard transparency, version control, and Fabric capacity optimization by surfacing redundant, duplicate, or heavy reports that could be consolidated or improved.",
    tags: [
      "Python",
      "pbixray",
      "Power BI",
      "Microsoft Fabric",
      "DAX",
      "Power Query",
      "BI Governance",
      "Automation",
    ],
  },
  {
    id: 8,
    title: "Customer Churn & Lifecycle Prediction",
    company: "Affine Analytics · Shutterstock",
    oneliner:
      "Built a customer lifecycle classification framework to identify churn risk and enable proactive, targeted retention",
    stats: [
      { label: "Retention Improvement", value: "~10%" },
      { label: "Lifecycle Segments", value: "4" },
    ],
    summary:
      "A churn and customer lifecycle framework for Shutterstock that moved the business from reactive churn reporting to proactive retention. Instead of only asking how many customers were lost, the framework helped identify which customers were at risk, which customers were inactive, and which customers could be targeted for winback or retention campaigns.",
    details: [
      "Defined four business meaningful lifecycle segments: active, inactive, churned, and winback",
      "Replaced a simple retained versus churned view with a more practical understanding of customer health and lifecycle stage",
      "Recognized that inactive customers are not always fully lost and that churned customers may still return, so each segment needed a different business strategy",
      "Aggregated raw activity into a customer level analytical profile, giving every customer one consistent record for modeling and segmentation",
      "Engineered RFM based features such as recency, frequency, and monetary value, along with engagement signals like declining order frequency, longer gaps between purchases, and lower spend",
      "Focused on early warning behaviors that appear before a customer fully churns, allowing the business to act while intervention is still possible",
      "Framed the problem as a multi class classification use case, with churn risk surfaced as the priority output for retention planning",
      "Kept features interpretable so stakeholders could understand the reason behind a risk score, such as widening purchase gaps or falling spend",
      "Validated model output against actual customer behavior instead of relying only on headline accuracy, since a naive model can look accurate while missing the at risk minority",
      "Converted model output into action ready segments so teams could monitor active users, reactivate inactive customers, send retention offers to churn risk users, and study winback patterns",
    ],
    impact:
      "Contributed to an estimated 10% improvement in customer retention by flagging at risk customers earlier and enabling targeted interventions instead of broad generic campaigns. The project moved the team from descriptive churn reporting to predictive, explainable analytics, improved campaign efficiency through lifecycle based targeting, and helped protect customer lifetime value by acting before revenue was lost.",
    tags: [
      "Python",
      "Machine Learning",
      "Multi Class Classification",
      "Customer Analytics",
      "RFM",
      "Churn Modeling",
      "Retention",
    ],
  },
]