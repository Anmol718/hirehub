const {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential,
} = require("@azure/search-documents");

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX;

const SEMANTIC_CONFIG_NAME = "jobs-semantic-config";
const PAGE_SIZE = 9;

const indexDefinition = {
  name: indexName,
  fields: [
    { type: "Edm.String", name: "id", key: true },
    { type: "Edm.String", name: "title", searchable: true, filterable: true, sortable: true },
    { type: "Edm.String", name: "company", searchable: true, filterable: true },
    { type: "Edm.String", name: "location", searchable: true, filterable: true },
    { type: "Edm.String", name: "jobType", filterable: true, facetable: true },
    { type: "Edm.String", name: "workMode", filterable: true, facetable: true },
    { type: "Edm.String", name: "experienceLevel", filterable: true, facetable: true },
    { type: "Edm.Double", name: "salary", filterable: true, sortable: true },
    { type: "Edm.String", name: "description", searchable: true },
    { type: "Collection(Edm.String)", name: "skills", searchable: true, filterable: true },
    { type: "Edm.String", name: "status", filterable: true },
    { type: "Edm.DateTimeOffset", name: "postedAt", filterable: true, sortable: true },
  ],
  semanticSearch: {
    defaultConfigurationName: SEMANTIC_CONFIG_NAME,
    configurations: [
      {
        name: SEMANTIC_CONFIG_NAME,
        prioritizedFields: {
          titleField: { name: "title" },
          contentFields: [{ name: "description" }],
          keywordsFields: [
            { name: "skills" },
            { name: "jobType" },
            { name: "location" },
            { name: "company" },
          ],
        },
      },
    ],
  },
};

let searchClient;
let indexClient;

function getSearchClient() {
  if (!searchClient) {
    searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));
  }
  return searchClient;
}

function getIndexClient() {
  if (!indexClient) {
    indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));
  }
  return indexClient;
}

function escapeODataString(value) {
  return String(value).replace(/'/g, "''");
}

function toSearchDocument(job) {
  return {
    id: job._id.toString(),
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.jobType || null,
    workMode: job.workMode || null,
    experienceLevel: job.experienceLevel || null,
    salary: job.salary ?? null,
    description: job.description,
    skills: job.skills || [],
    status: job.status,
    postedAt: job.postedAt || null,
  };
}

function fromSearchDocument(doc) {
  return {
    _id: doc.id,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    jobType: doc.jobType,
    workMode: doc.workMode,
    experienceLevel: doc.experienceLevel,
    salary: doc.salary,
    description: doc.description,
    skills: doc.skills || [],
    postedAt: doc.postedAt,
  };
}

// Creates the index with semantic search enabled if it doesn't exist yet, or
// updates it to add the semantic configuration if it's missing.
module.exports.ensureIndex = async () => {
  await getIndexClient().createOrUpdateIndex(indexDefinition);
};

module.exports.indexJob = async (job) => {
  await getSearchClient().mergeOrUploadDocuments([toSearchDocument(job)]);
};

module.exports.deleteJobFromIndex = async (jobId) => {
  await getSearchClient().deleteDocuments("id", [jobId.toString()]);
};

module.exports.searchJobs = async (query, { jobType, location, page = 1, pageSize = PAGE_SIZE } = {}) => {
  const filters = ["status eq 'approved'"];
  if (jobType) filters.push(`jobType eq '${escapeODataString(jobType)}'`);
  if (location) filters.push(`search.ismatch('${escapeODataString(location)}', 'location')`);

  const result = await getSearchClient().search(query, {
    queryType: "semantic",
    semanticSearchOptions: { configurationName: SEMANTIC_CONFIG_NAME },
    filter: filters.join(" and "),
    top: pageSize,
    skip: (page - 1) * pageSize,
    includeTotalCount: true,
  });

  const jobs = [];
  for await (const item of result.results) {
    jobs.push(fromSearchDocument(item.document));
  }

  return { jobs, totalCount: result.count || 0 };
};
