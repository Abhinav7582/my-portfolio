export const projects = [
  {
    id: 1,
    title: "AI-Assisted EDA & Documentation Platform",
    company: "MiQ",
    category: "AI & Automation",
    featured: true,
    status: "In Development",
    oneliner:
      "Automates project documentation and repeatable EDA across governed Databricks data sources, reducing documentation turnaround from days to approximately 12 minutes",
    stats: [
      { label: "Documentation Time", value: "Days → ~12 min" },
      { label: "Repeat EDA Effort", value: "~50% lower" },
    ],
    summary:
      "An initiative to integrate agentic AI into the day-to-day analyst workflow at MiQ by automating two repetitive parts of analytics work: exploratory analysis and project documentation. The platform combines context from project tickets, notebooks, code, and analysis files to create structured documentation and reusable EDA outputs while operating within approved enterprise tooling and data-governance controls.",
    details: [
      "Built the first phase as a documentation agent in Cursor using Claude and MCP connectors across Jira, Confluence, Bitbucket, Databricks, and Google Docs",
      "Designed a multi-source workflow that retrieves business context, code, notebooks, analysis files, and validation results before assembling them into a coherent project document",
      "Generated structured documentation covering the business problem, objectives, technical approach, code references, analysis, validation, results, and known limitations",
      "Engineered reusable prompts aligned with internal documentation standards so outputs remained consistent, reviewable, and specific to each project",
      "Extended the same foundation into an EDA agent designed to work against governed Unity Catalog data sources",
      "Standardised recurring analytical checks including schema profiling, duplicate detection, null analysis, table freshness, distribution checks, and documentation of transformation logic",
    ],
    impact:
      "Reduced standard project documentation turnaround from multiple days to approximately 12 minutes, including human review and validation. The reusable EDA layer reduced repeat analysis effort by approximately 50% and lowered dependency on undocumented analyst knowledge.",
    tags: [
      "Agentic AI",
      "Cursor",
      "Claude",
      "MCP",
      "Databricks",
      "Unity Catalog",
      "PySpark",
      "Prompt Engineering",
    ],
  },
  {
    id: 2,
    title: "DSP Discrepancy & Data Stability Pipeline",
    company: "MiQ",
    category: "Data Engineering",
    featured: true,
    oneliner:
      "Monitors T-1 discrepancies and data freshness across four major DSPs, reducing pipeline runtime from two hours to 20–30 minutes",
    stats: [
      { label: "Pipeline Runtime", value: "2 hrs → 20–30 min" },
      { label: "Compute Savings", value: "~$11.5K" },
    ],
    summary:
      "A production pipeline that detects data-quality issues across major demand-side platforms before they reach downstream reporting. The system compares DSP-reported delivery against standardised internal records, highlights the largest discrepancies, tracks how long each platform takes to stabilise, and sends a concise daily summary to Slack. The pipeline was also re-engineered to replace an expensive full-history process with efficient incremental processing.",
    details: [
      "Compared previous-day DSP delivery against standardised internal tables across DV360, The Trade Desk, Yahoo, and Amazon using incremental processing with a seven-day lookback",
      "Reduced runtime from more than two hours to 20–30 minutes through caching, column projection, partition pruning, and partitioning by date, advertiser, and advertising account",
      "Applied approximate distinct counts only to non-financial, high-cardinality profiling while retaining exact calculations for core discrepancy and cost metrics",
      "Calculated metric-level differences and generated trend charts and discrepancy buckets to show where data mismatches were concentrated",
      "Identified the dates, DSPs, campaigns, and accounts responsible for the largest mismatches so analysts could prioritise investigation",
      "Added data-stability monitoring to distinguish genuine tracking issues from platforms whose delivery numbers had not yet finalised",
      "Aligned Yahoo validation to campaign-level reporting grain so the comparison reflected the platform's actual business logic",
      "Automated daily stakeholder summaries through Slack, removing the need to manually inspect notebooks and supporting files",
    ],
    impact:
      "Eliminated repetitive manual discrepancy checks, improved confidence in reporting across four major DSPs, and contributed approximately $11.5K in compute savings. Teams could identify high-impact mismatches earlier while separating actual tracking problems from expected data-finalisation delays.",
    tags: [
      "PySpark",
      "Databricks",
      "SQL",
      "Performance Tuning",
      "Slack API",
      "AdTech",
      "Data Quality",
      "Pipeline Automation",
    ],
  },
  {
    id: 3,
    title: "MSX-to-Xandr Revenue Reconciliation",
    company: "Affine Analytics · Microsoft MSN",
    category: "AdTech Analytics",
    featured: false,
    oneliner:
      "Validated revenue and impression parity during Microsoft's advertising-platform migration using distributed analysis over terabyte-scale auction logs",
    stats: [
      { label: "Analysis Turnaround", value: "1 week → 2 days" },
      { label: "Data Scale", value: "TB-scale logs" },
    ],
    summary:
      "As Microsoft MSN transitioned monetisation reporting from MSX to Xandr, stakeholders needed confidence that impressions and revenue remained consistent between the two systems. The source data existed in terabyte-scale auction logs, requiring distributed querying, carefully selected diagnostic samples, and repeatable source-to-target reconciliation.",
    details: [
      "Owned MSX-to-Xandr reconciliation across terabyte-scale, log-level auction data stored in Azure Cosmos DB",
      "Used Apache Hive to query and aggregate raw advertising logs at a scale that could not be handled through standard reporting tables alone",
      "Performed aggregate source-to-target checks and used peak-hour samples for deeper diagnostics into placement, auction, and revenue differences",
      "Validated impression consistency and revenue parity within agreed reconciliation thresholds before migration sign-off",
      "Reduced the turnaround for a complete flight analysis from one analyst-week to two days",
      "Created a repeatable reconciliation approach that supported the wider migration of monetisation partners into Xandr reporting",
    ],
    impact:
      "Reduced flight analysis from one week to two days while validating revenue and impression parity within agreed tolerances. The approach made terabyte-scale reconciliation practical and gave stakeholders greater confidence in the transition to Xandr reporting.",
    tags: [
      "Apache Hive",
      "Azure Cosmos DB",
      "SQL",
      "AdTech",
      "Revenue Reconciliation",
      "Big Data",
      "Data Validation",
    ],
  },
  {
    id: 4,
    title: "Microsoft MSN AdTech Revenue Diagnostics",
    company: "Affine Analytics · Microsoft MSN",
    category: "AdTech Analytics",
    featured: true,
    oneliner:
      "Built revenue diagnostics across MSN's advertising ecosystem and re-architected a 4.8 GB Power BI model to support decisions affecting ~$0.64M",
    stats: [
      { label: "Revenue Movement Analysed", value: ">$4M" },
      { label: "Power BI Model", value: "4.8 GB → <1 GB" },
    ],
    summary:
      "A monetisation analytics initiative focused on explaining revenue movement across MSN markets, experiences, page types, ad formats, and demand partners. The work combined reporting logic, Power BI model design, SSP diagnostics, automated alerting, and stakeholder commentary to move teams from high-level performance tracking to faster, defensible root-cause analysis.",
    details: [
      "Built and enhanced revenue reporting that decomposed movement into rate, volume, mix, geography, experience, page type, ad format, and demand-partner drivers",
      "Developed a Top Contributors dashboard that ranked the largest positive and negative revenue drivers across markets, placements, formats, and bidders",
      "Reduced a Power BI model from approximately 4.8 GB to under 1 GB through star-schema remodelling, DAX measure conversion, and lower-cardinality Power Query transformations",
      "Resolved DirectQuery and memory constraints, enabling a page-type reassignment decision affecting approximately $0.64M in revenue across the US, seven priority international markets, and the rest of the world",
      "Corrected experience-level reporting by identifying inconsistent mappings between placement and page identifiers, then re-validating revenue and impression allocation",
      "Built ETL across more than 20 SSP and reporting sources, improving refresh latency by approximately 45% and query performance by approximately 75%",
      "Created automated alerts when unmapped publisher revenue exceeded approximately 0.5%, surfacing mapping and data-quality gaps before stakeholder reporting",
      "Automated recurring performance commentary that connected revenue changes to rate, volume, mix, placement, format, and partner-level drivers",
    ],
    impact:
      "Improved the team's ability to diagnose more than $4M in revenue movement across the US, seven priority international markets, and the rest of the world. The Power BI rearchitecture enabled analysis supporting a page-type reassignment decision affecting approximately $0.64M while substantially reducing manual investigation.",
    tags: [
      "Power BI",
      "DAX",
      "Power Query",
      "SQL",
      "AdTech",
      "SSP Analytics",
      "Revenue Diagnostics",
      "Data Modeling",
    ],
  },
  {
    id: 5,
    title: "Sigma Browsing Feed Migration",
    company: "MiQ",
    category: "Data Engineering",
    featured: false,
    oneliner:
      "Migrated MiQ Sigma's browsing feed from Xandr to Index Exchange across billions of daily records and 11 countries with zero production downtime",
    stats: [
      { label: "Runtime Reduction", value: "~60%" },
      { label: "Countries Standardised", value: "11" },
    ],
    summary:
      "MiQ Sigma's browsing feed depended on Xandr, a source scheduled for deprecation. I led the migration to Index Exchange by analysing the replacement data, rebuilding the transformations as a scalable PySpark pipeline, validating regional coverage, and productionising the workflow before the legacy dependency could affect the live product.",
    details: [
      "Performed detailed exploratory analysis across US, APAC, and EMEA datasets to understand how Index Exchange differed from the existing Xandr feed",
      "Rebuilt the transformation pipeline in PySpark on Databricks, processing billions of daily records into a structured Sigma-ready output",
      "Reduced pipeline runtime by approximately 60% through optimised transformations, partition-aware processing, and efficient aggregations",
      "Implemented IAB taxonomy mapping for content classification and ISO-based geography resolution",
      "Added peak-hour detection and daypart windowing so the feed represented time-based browsing behaviour rather than only aggregated events",
      "Standardised output across 11 countries by handling differences in volume, country codes, time zones, and category coverage",
      "Validated row counts, schemas, null rates, category mappings, geography mappings, and time-based aggregations before production release",
      "Productionised the workflow as a recurring weekly Databricks pipeline with no interruption to the live Sigma product",
    ],
    impact:
      "Protected business continuity by replacing a deprecated source before it could disrupt MiQ Sigma. The migration introduced Index Exchange as a production-ready data source, reduced runtime by approximately 60%, and standardised taxonomy, geography, and time-based enrichment across 11 countries.",
    tags: [
      "PySpark",
      "Databricks",
      "Python",
      "SQL",
      "IAB Taxonomy",
      "Data Pipelines",
      "Product Analytics",
      "Performance Tuning",
    ],
  },
  {
    id: 6,
    title: "Multi-Platform API Ingestion Framework",
    company: "MiQ",
    category: "Data Engineering",
    featured: false,
    oneliner:
      "Standardised API ingestion, deduplication, and validation across seven advertising platforms, saving approximately 40 analyst hours per month",
    stats: [
      { label: "Platforms Automated", value: "7" },
      { label: "Analyst Time Saved", value: "~40 hrs/month" },
    ],
    summary:
      "Custom reporting and insights work at MiQ required data from multiple advertising platforms, each with different APIs, schemas, reporting grains, and delivery behaviour. This framework introduced a reusable ingestion pattern that scoped API calls to the required accounts and applied consistent deduplication and validation before the data reached downstream analytics.",
    details: [
      "Built reusable API ingestion across seven advertising platforms, including Yahoo, The Trade Desk, Beeswax, Snapchat, Pinterest, and Amazon",
      "Scoped API calls to only the advertising accounts and seats required, minimising extraction time, API cost, and rate-limit consumption",
      "Standardised source-specific deduplication logic so data from different platforms could be consumed at the correct reporting grain",
      "Applied consistent schema, freshness, completeness, and metric-level validation during ingestion",
      "Landed normalised outputs in structured Databricks tables ready for downstream insights, dashboards, and reporting workflows",
      "Designed the framework so additional platforms could reuse the same ingestion, validation, and orchestration pattern rather than requiring an independent build",
    ],
    impact:
      "Saved approximately 40 analyst hours per month by replacing manual, platform-specific data pulls with a standardised ingestion framework. Scoped API calls reduced unnecessary processing, while reusable validation ensured downstream analytics started from reliable and comparable data.",
    tags: [
      "Python",
      "PySpark",
      "Databricks",
      "REST APIs",
      "Data Ingestion",
      "AdTech",
      "Data Quality",
      "Automation",
    ],
  },
  {
    id: 7,
    title: "DSP Operations Monitoring & IO Mapping",
    company: "MiQ",
    category: "AdTech Analytics",
    featured: false,
    oneliner:
      "Automated DSP SLA, cost-reconciliation, and IO-mapping workflows, making approximately $82K in media spend visible and attributable",
    stats: [
      { label: "Spend Visibility", value: "~$82K" },
      { label: "Reporting Delivery", value: "Automated weekly" },
    ],
    summary:
      "A suite of related reporting pipelines that gave stakeholders recurring visibility into DSP SLA performance, accrued-versus-tracked cost, and insertion-order-level media spend. The workflows replaced manual checks with scheduled reporting and made previously difficult-to-track spend easier to identify and attribute.",
    details: [
      "Built weekly DSP SLA monitoring that tracked delivery performance and distributed charts and status updates through Slack",
      "Developed an Accrued versus Tracked Cost pipeline so finance and trading stakeholders could monitor cost movement without manually assembling reports",
      "Designed DSP IO-mapping models that joined Index Exchange and DSP delivery data to IAB category standards across the US, UK, Canada, and Southeast Asia",
      "Made approximately $82K in media spend visible and attributable at the insertion-order level",
      "Built streamlined Campaign-to-IO reference tables that delivered market-specific outputs through automated email reporting",
      "Converted the workflows into scheduled Databricks pipelines with repeatable validation and stakeholder delivery",
    ],
    impact:
      "Provided dependable weekly visibility into DSP SLA performance, cost movement, and IO-level media spend. The mapping work made approximately $82K in spend easier to identify and attribute, while automation removed recurring manual reporting for finance, trading, and analytics teams.",
    tags: [
      "PySpark",
      "Databricks",
      "SQL",
      "Slack API",
      "AdTech",
      "Cost Analytics",
      "IO Mapping",
      "Reporting Automation",
    ],
  },
  {
    id: 8,
    title: "Pond5 Pricing & Elasticity Study",
    company: "Affine Analytics · Shutterstock",
    category: "Experimentation",
    featured: true,
    oneliner:
      "Used a staggered US-to-ROW pricing rollout as a quasi-experiment to quantify HD and 4K pricing impact and guide discount strategy",
    stats: [
      { label: "HD Opportunity", value: "~$104K" },
      { label: "4K Opportunity", value: "~$53K" },
    ],
    summary:
      "Pond5 introduced pricing changes through a staggered US-to-rest-of-world rollout, creating a natural experiment. I used the difference in rollout timing to separate pricing effects from underlying business trends, evaluated the performance of HD and 4K products, and analysed whether a broad rest-of-world discount was changing customer behaviour.",
    details: [
      "Structured the staggered US-to-rest-of-world rollout as a quasi-experimental analysis to isolate the effect of pricing changes from background trends",
      "Compared product performance against relevant benchmarks and found HD approximately 30% below expected performance while 4K remained approximately 24% above",
      "Recommended adjusting HD pricing from $59 to $39 and quantified an approximately $104K HD and $53K 4K revenue opportunity",
      "Separately analysed price elasticity for Pond5's 60% rest-of-world discount",
      "Found that returning buyers were comparatively price-insensitive, indicating that part of the discount was subsidising customers likely to purchase anyway",
      "Identified discount leakage across USD and EUR purchases and recommended a phased rollback supported by customer and currency-level analysis",
      "Translated the statistical results into decision-ready pricing recommendations for business stakeholders",
    ],
    impact:
      "Quantified an approximately $104K HD and $53K 4K pricing opportunity by turning a staggered rollout into a structured quasi-experiment. The elasticity analysis also gave stakeholders evidence that the rest-of-world discount could be reduced in phases without applying the same treatment to every customer segment.",
    tags: [
      "Python",
      "SQL",
      "Snowflake",
      "Quasi-Experimental Design",
      "Causal Inference",
      "Price Elasticity",
      "Pricing Analytics",
      "Statistical Analysis",
    ],
  },
  {
    id: 9,
    title: "Power BI Metadata & Governance Platform",
    company: "Affine Analytics · DuPont",
    category: "BI & Governance",
    featured: false,
    oneliner:
      "Automated metadata extraction and comparison across 6,000+ Power BI assets, converting the POC into an approximately $45K governance engagement",
    stats: [
      { label: "Engagement Conversion", value: "~$45K" },
      { label: "Power BI Estate", value: "6,000+ assets" },
    ],
    summary:
      "A BI governance and automation proof of concept designed to answer an enterprise-scale question: what logic, data models, and visual structures exist across thousands of Power BI assets without manually opening every file? The solution extracted report and model metadata programmatically and transformed it into structured output for comparison, governance, migration, and consolidation analysis.",
    details: [
      "Retrieved PBIP definitions and report exports across more than 6,000 Power BI assets using the Power BI REST API",
      "Used pbixray to extract model metadata from PBIX files, including tables, columns, data types, Power Query logic, DAX measures, calculated tables, and relationships",
      "Parsed report layout JSON to capture page-level and visual-level metadata including visuals, filters, fields, and layout structure",
      "Built comparison logic to identify differences across tables, measures, relationships, transformation logic, visuals, and report structure",
      "Supported duplicate detection, version comparison, migration validation, report consolidation, and Fabric capacity analysis",
      "Delivered the results through a structured multi-sheet Excel workbook so stakeholders could review findings without inspecting raw JSON or PBIX internals",
    ],
    impact:
      "Demonstrated enough technical and business value to convert the proof of concept into an approximately $45K governance engagement. The framework improved transparency across more than 6,000 Power BI assets and helped identify redundant, duplicate, or resource-intensive reports for consolidation and capacity optimisation.",
    tags: [
      "Python",
      "Power BI REST API",
      "pbixray",
      "Power BI",
      "Microsoft Fabric",
      "DAX",
      "BI Governance",
      "Automation",
    ],
  },
  {
    id: 10,
    title: "Product Recommendation Engine",
    company: "Affine Analytics · Blue Nile",
    category: "Machine Learning",
    featured: true,
    oneliner:
      "Built a content-based cross-sell engine using TF-IDF, semantic product features, and price bands, improving recommendation relevance by approximately 40%",
    stats: [
      { label: "Recommendation Relevance", value: "+40%" },
      { label: "Observed Conversion Lift", value: "~10%" },
    ],
    summary:
      "A personalisation engine for Blue Nile, a high-consideration jewelry retailer with sparse product-interaction histories. Instead of relying only on collaborative filtering, the solution used engineered product content, customer intent signals, and business constraints to recommend complementary products suitable for cross-sell.",
    details: [
      "Replaced a LightFM collaborative-filtering approach with content-based cosine similarity better suited to sparse interaction histories and cold-start products",
      "Engineered TF-IDF vectors from product titles and descriptions using NLTK lemmatisation, part-of-speech tagging, and stopword removal",
      "Applied cross-category filtering so the engine recommended complementary products instead of returning visually similar alternatives",
      "Created decile-based price bands within each product type to keep recommendations commercially appropriate for the customer",
      "Modelled purchase intent through weighted implicit feedback across browsing, wishlist, cart, and purchase behaviour",
      "Applied business filters to exclude previously purchased items and manually reviewed recommendations for category fit, intent alignment, and price suitability",
    ],
    impact:
      "Improved recommendation relevance by approximately 40% and was associated with an observed conversion improvement of approximately 10%. The content-based approach addressed sparse interaction data while keeping recommendations explainable and aligned with genuine cross-sell behaviour.",
    tags: [
      "Python",
      "scikit-learn",
      "TF-IDF",
      "NLP",
      "Cosine Similarity",
      "Recommendation Systems",
      "Feature Engineering",
      "Personalisation",
    ],
  },
  {
    id: 11,
    title: "Customer Churn & Lifecycle Prediction",
    company: "Affine Analytics · Shutterstock",
    category: "Machine Learning",
    featured: false,
    oneliner:
      "Built explainable churn and lifecycle models that supported targeted retention campaigns achieving a 30% customer win-back rate",
    stats: [
      { label: "Campaign Win-Back Rate", value: "30%" },
      { label: "Models Benchmarked", value: "LogReg vs XGBoost" },
    ],
    summary:
      "A churn and lifecycle framework that moved customer analysis from reactive reporting toward proactive retention. The solution identified customers showing early signs of disengagement, classified them by lifecycle stage, and provided interpretable risk signals that business teams could use to target different retention actions.",
    details: [
      "Built segment-level churn models in Snowflake using forward-looking labels so the models predicted future churn rather than describing historical inactivity",
      "Benchmarked logistic regression against XGBoost, balancing predictive performance with interpretability for stakeholder-facing decisions",
      "Engineered recency, frequency, and monetary-value features alongside early-warning signals such as declining purchase frequency, widening order gaps, and falling spend",
      "Classified customers into active, at-risk, inactive, and win-back lifecycle stages so each segment could receive a different retention treatment",
      "Kept model outputs interpretable by surfacing the behavioural changes contributing to each customer's risk classification",
      "Evaluated model usefulness against actual customer behaviour and minority-class performance rather than relying only on headline accuracy",
    ],
    impact:
      "Supported targeted retention campaigns that achieved a 30% customer win-back rate. The framework allowed teams to act on early, explainable churn signals and tailor interventions by lifecycle stage instead of relying on broad retention campaigns.",
    tags: [
      "Python",
      "Snowflake",
      "XGBoost",
      "scikit-learn",
      "Feature Engineering",
      "Churn Modeling",
      "Classification",
      "Retention Analytics",
    ],
  },
  {
    id: 12,
    title: "Blue Nile Funnel & Lifecycle Pipeline",
    company: "Affine Analytics · Blue Nile",
    category: "Data Engineering",
    featured: false,
    oneliner:
      "Built dbt models orchestrated through Airflow to unify browsing and purchase behaviour for funnel analysis and lifecycle-based personalisation",
    stats: [
      { label: "Pipeline Stack", value: "dbt + Airflow" },
      { label: "Primary Outputs", value: "Funnel · Personalisation" },
    ],
    summary:
      "The data-engineering foundation behind Blue Nile's customer analytics and recommendation workflows. Browsing and purchase data existed across separate sources and required consistent transformation, testing, and orchestration before it could support funnel reporting, lifecycle segmentation, and recommendation eligibility.",
    details: [
      "Built dbt models that unified browsing, purchase, product, and customer data into consistent analysis-ready tables",
      "Orchestrated the transformation workflow through Apache Airflow so pipelines ran reliably on a defined schedule",
      "Produced a reusable funnel layer showing how customers progressed from browsing and product engagement toward purchase",
      "Created an eligibility layer that controlled recommendation frequency according to customer lifecycle stage",
      "Maintained feature consistency between analytical dashboards and the downstream recommendation engine",
      "Implemented dbt validation for joins, duplicates, null handling, and metric consistency so data issues surfaced before stakeholder reporting",
    ],
    impact:
      "Created a reliable and reusable data foundation for funnel analysis and lifecycle-based personalisation. Modelling the data once through dbt and Airflow allowed dashboards and recommendation workflows to consume the same validated customer and product logic.",
    tags: [
      "dbt",
      "Apache Airflow",
      "SQL",
      "Python",
      "Data Modeling",
      "Funnel Analysis",
      "Pipeline Orchestration",
      "Customer Analytics",
    ],
  },
];