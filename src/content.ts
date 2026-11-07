// All text and data shown on the site lives here. Edit this file to change content.

export const LINKEDIN_URL: string = ''; // e.g. 'https://www.linkedin.com/in/your-handle' — empty hides the link
export const GITHUB_URL = 'https://github.com/NajibF24';
export const EMAIL = 'najibfauzan88@gmail.com';
// Optional portrait: put a file in /public (e.g. /public/photo.jpg) and set '/photo.jpg'. Empty = no photo.
export const PHOTO_URL: string = '';

export const person = {
  name: 'Muhammad Najib Fauzan',
  shortName: 'Najib Fauzan',
  headline: 'DevSecOps / Platform Engineer',
  location: 'Jakarta, Indonesia',
  tagline:
    'I build the platform under ~45 production apps: one pipeline that scans everything, GitOps that never drifts, secrets nobody copies by hand, and backups that have actually been restored.',
  availability: 'Open to senior DevOps, platform and cloud-security roles in Jakarta or remote.',
};

export const about = {
  paragraphs: [
    'Three years in, I am the sole DevSecOps and platform engineer at PT Garuda Yamato Steel, a steel manufacturer running about 45 internal applications across dev, staging, production and an AWS disaster-recovery cluster.',
    'I built the company-wide platform from the ground up: a shared GitLab CI template with secret, dependency, container and DAST scanning; ArgoCD and Helm GitOps across four Kubernetes clusters; Terraform onboarding that turns twelve manual steps into one merge request; OpenBao secrets with External Secrets Operator; an Elastic SIEM; and verified backup and DR for Kubernetes, PostgreSQL and SQL Server.',
    'My rule of thumb: secure defaults over gates that slow developers down, automate anything done twice, and treat every incident as a reason to write a guard.',
  ],
  facts: [
    { value: '45+', label: 'applications on the platform' },
    { value: '487', label: 'ArgoCD Applications replaced by ApplicationSets' },
    { value: '85', label: 'SIEM detection rules, up from 4' },
    { value: '1 MR', label: 'to onboard a new app end to end' },
  ],
};

// Platform diagram: stages flow left to right; gates are the checks a change must pass.
export const platform = {
  title: 'The platform I built',
  intro:
    'Every change to any of the 45+ applications travels this path. Security is a property of the path, not a step developers have to remember.',
  stages: [
    {
      id: 'git',
      name: 'GitLab',
      summary: 'Projects, protected branches and CI variables created by Terraform from one catalog file.',
      gates: ['Gitleaks secret scanning', 'Protected branches'],
    },
    {
      id: 'ci',
      name: 'CI pipeline',
      summary: 'One template (gys-pipeline) used by 49 repositories. It fails only on what matters.',
      gates: ['Trivy filesystem scan', 'SonarQube quality gate', 'Build pinned by digest'],
    },
    {
      id: 'harbor',
      name: 'Harbor',
      summary: 'Scan-on-push, images pinned by digest, weekly base-image rebuilds with 10-minute auto-rollback.',
      gates: ['Trivy image scan', 'Critical CVE policy'],
    },
    {
      id: 'argocd',
      name: 'ArgoCD',
      summary: 'ApplicationSets for every environment, zero spec drift, one shared Helm chart.',
      gates: ['OWASP ZAP DAST', 'Smoke-test gate', 'Production approval'],
    },
    {
      id: 'clusters',
      name: 'Kubernetes',
      summary: 'Dev, staging and production on RKE2, pilot-light DR on AWS EKS. Secrets arrive through External Secrets from OpenBao.',
      gates: ['OpenBao secrets', 'Probes, HPA, PDB', 'Encrypted etcd backups'],
    },
  ],
  clusters: [
    { name: 'dev', apps: 148 },
    { name: 'staging', apps: 129 },
    { name: 'production', apps: 131 },
    { name: 'DR on EKS', apps: 79 },
  ],
};

export const experience = [
  {
    company: 'PT Garuda Yamato Steel',
    role: 'DevOps Engineer & Database Administrator Specialist',
    place: 'Cikarang',
    period: 'Oct 2025 – present',
    summary: 'Sole DevSecOps and platform engineer for ~45 internal applications across dev, staging, production and AWS DR.',
    highlights: [
      'Built the shared GitLab CI template used by 49 repositories: Gitleaks, Trivy, SonarQube custom gate, OWASP ZAP, Harbor scan-on-push and a smoke-test gate that fails only on boot, health or information-leak issues.',
      'Replaced 487 hand-written ArgoCD Applications with ApplicationSets across dev, staging, production and DR with zero spec drift; one shared Helm chart with probes, HPA and PDB.',
      'Terraform and Node generators onboard an app from one catalog file: GitLab, Harbor, SonarQube, PostgreSQL, OpenBao, NFS, Dockerfiles, Helm values and ArgoCD, down from ~12 manual steps.',
      'Deployed OpenBao (Raft, LDAPS, audit log, Kubernetes auth per cluster) with External Secrets Operator; nightly encrypted snapshots with tested restore.',
      'Dependency-CVE bot: 42 fixable critical CVEs across 76 production images, auto-merged patch fixes, weekly digest-pinned base-image rebuilds with 10-minute auto-rollback.',
      'Elastic SIEM: detection rules from 4 to 85, 11 dashboards as code, Shuffle SOAR triage; detected and escalated an M365 account compromise.',
      'Recovered a production etcd outage without a restart, then expanded the control plane from 1 to 3 masters; fixed PostgreSQL backups that had silently failed for months.',
      'Migrated 15 SQL Server databases (594 tables, 72 stored procedures) to PostgreSQL with a parallel sync tool.',
    ],
  },
  {
    company: 'PT PLN Icon Plus',
    role: 'Junior DevOps Engineer',
    place: 'Jakarta',
    period: 'Jan 2023 – Oct 2025',
    summary: 'CI/CD, containers and observability.',
    highlights: [
      'Optimized CI/CD pipelines and deployed containerized workloads with Docker and Kubernetes.',
      'Led migration of a large-scale application to a cloud-native architecture.',
      'Implemented observability with Grafana and SigNoz: metrics, traces and alerting.',
      'Worked across development and infrastructure teams to resolve production incidents.',
    ],
  },
  {
    company: 'PT BFI Finance Tbk',
    role: 'Custodian Staff',
    place: 'Jakarta',
    period: 'Jan 2019 – Dec 2021',
    summary: 'Document custody and reporting.',
    highlights: [
      'Processed vehicle ownership documents and resolved customer inquiries.',
      'Produced compliance and daily asset-flow reports supporting audit readiness.',
    ],
  },
];

export const projects = [
  {
    name: 'GYS DevSecOps Platform',
    year: '2025 – 2026',
    summary: 'GitLab CI, Harbor and ArgoCD/Helm GitOps for ~45 apps on 4 Kubernetes clusters plus AWS EKS DR. Scanning on every pipeline, one-file Terraform onboarding, OpenBao secrets, automated CVE remediation.',
    tags: ['GitLab CI', 'ArgoCD', 'Terraform', 'Helm', 'OpenBao'],
    metric: { value: '45+', label: 'apps' },
  },
  {
    name: 'secdash',
    year: '2026',
    summary: 'Security and pipeline-approval dashboard: FastAPI, Celery and React with a WhatsApp bot for production approvals. RBAC with 6 roles, webhook authentication on 71 hooks, Trivy, ZAP and Sonar findings per app, weekly PDF reports.',
    tags: ['FastAPI', 'Celery', 'React', 'WhatsApp bot'],
    metric: { value: '71', label: 'hooks authenticated' },
  },
  {
    name: 'Elastic SIEM, SOAR and SIEM portal',
    year: '2026',
    summary: '85 detection rules, DC, DNS, DHCP and SQL audit sources, 11 dashboards as code and Shuffle SOAR triage. A Fastify and React portal with LDAP login, case SLA (MTTA/MTTR) and a catalog-restricted LLM assistant.',
    tags: ['Elastic', 'Shuffle SOAR', 'Fastify', 'LLM'],
    metric: { value: '85', label: 'detection rules' },
  },
  {
    name: 'AWS pilot-light disaster recovery',
    year: '2026',
    summary: 'EKS Auto Mode spoke under on-prem ArgoCD, Harbor to ECR replication, generated DR values for 79 apps, and a DR drill with PostgreSQL restore and SQL Server reconciliation.',
    tags: ['AWS EKS', 'ArgoCD', 'ECR', 'DR drill'],
    metric: { value: '79', label: 'apps in DR' },
  },
  {
    name: 'SQL Server to PostgreSQL migration',
    year: '2026',
    summary: '15 databases, 594 tables and 72 stored procedures moved with a parallel sync tool (retries, adaptive batching) and PL/pgSQL ports of SQL Agent jobs.',
    tags: ['PostgreSQL', 'SQL Server', 'PL/pgSQL', 'Python'],
    metric: { value: '594', label: 'tables migrated' },
  },
  {
    name: 'Automated database backup system',
    year: '2025 – 2026',
    summary: 'pgBackRest plus daily pg_dump for PostgreSQL, SQL Agent backup jobs for SQL Server, etcd and secrets backups to NAS, and restore validation.',
    tags: ['pgBackRest', 'SQL Agent', 'etcd', 'NAS'],
    metric: { value: 'daily', label: 'verified backups' },
  },
  {
    name: 'IoT digital caliper integration',
    year: '2025',
    summary: 'Digitized QC measurement with IoT calipers, coordinating vendors and QC teams through to production rollout; remediated a leaked-credential repository found during onboarding.',
    tags: ['IoT', 'Quality control', 'Security remediation'],
    metric: { value: 'IoT', label: 'on the shop floor' },
  },
  {
    name: 'Truck tracker and virtual plant',
    year: '2026',
    summary: 'Real-time 3D tracking (Node, Socket.IO, Three.js) fed by weighbridge, access-control and GPS systems through read-only database access, with CCTV plate hints from vision models.',
    tags: ['Three.js', 'Socket.IO', 'Node.js', 'Vision models'],
    metric: { value: '3D', label: 'live plant view' },
  },
];

export const skills = [
  {
    group: 'Cloud security and secrets',
    items: ['OpenBao / Vault', 'External Secrets Operator', 'Gitleaks', 'Key and snapshot rotation', 'Least-privilege API keys', 'Active Directory / LDAPS', 'Microsoft Entra ID'],
  },
  {
    group: 'CI/CD security',
    items: ['GitLab CI templates', 'SonarQube quality gates', 'Trivy', 'OWASP ZAP', 'Harbor scan-on-push', 'Dependency-CVE automation', 'Image pinning by digest'],
  },
  {
    group: 'IaC and GitOps',
    items: ['Terraform', 'Helm', 'ArgoCD + ApplicationSets', 'Reflector / Reloader', 'Hub-spoke multi-cluster'],
  },
  {
    group: 'Containers and Kubernetes',
    items: ['Docker / BuildKit', 'Hardened non-root images', 'RKE2 / Rancher', 'AWS EKS', 'HPA / PDB / probes', 'etcd operations and recovery'],
  },
  {
    group: 'Cloud and network',
    items: ['AWS (EKS, ECR, RDS, DMS, IAM, Lightsail)', 'Cloudflare', 'F5 BIG-IP', 'DNS / DHCP', 'TLS', 'NFS', 'Windows Server and GPO'],
  },
  {
    group: 'Observability and SIEM',
    items: ['Elastic SIEM', 'Shuffle SOAR', 'VictoriaLogs', 'Prometheus', 'Grafana', 'Fluent Bit', 'SigNoz'],
  },
  {
    group: 'Databases and DR',
    items: ['PostgreSQL (Patroni, pgBackRest)', 'SQL Server (Agent, Audit, dbatools)', 'MariaDB', 'Redis', 'etcd snapshots', 'Pilot-light DR', 'DR drills'],
  },
  {
    group: 'Languages and AI tooling',
    items: ['Bash', 'PowerShell', 'Python', 'Node.js / TypeScript', 'Go (basic)', 'SQL / PL/pgSQL', 'Claude Code', 'OpenAI API', 'RAG'],
  },
];

export const certifications = [
  'DevOps and AI on AWS: Upgrading Apps with Generative AI, Amazon Web Services, 2025',
  'Introduction to DevOps, IBM, 2024',
];

export const education = [
  'Bachelor of Management, STIE TotalWin Jakarta, 2017 – 2021',
  'Diploma of Computerized Accounting, LP3I College Semarang, 2017 – 2019',
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'platform', label: 'Platform' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
