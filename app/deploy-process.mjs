#!/usr/bin/env zx

// export service=gamingaffiliates
// export service=best-brokers-partners
// export service=freevpnplanet
// export service=fxoro

// ./deploy-process.mjs --step=create --prod
// ./deploy-process.mjs --step=dns --prod
// ./deploy-process.mjs --step=secret --prod

// ./deploy-process.mjs --step=secret
// ./deploy-process.mjs --step=verify --prod
// ./deploy-process.mjs --step=verify --prod --service=freevpnplanet
// ./deploy-process.mjs --step=dns --service=freevpnplanet
// ./deploy-process.mjs --step=create --prod --service=fxoro
// ./deploy-process.mjs --step=secret --prod --service=fxoro
// ./deploy-process.mjs --step=dns --prod --service=fxoro
// ./deploy-process.mjs --step=dns
// ./deploy-process.mjs --step=secret --prod
// ./deploy-process.mjs --step=secret
// ./deploy-process.mjs --step=db-connection -- prod

import { sites } from "./deploy.secrets.mjs";

const { _, step, service: serviceArg, prod: deployProd } = argv;

const service = serviceArg || process.env.SERVICE;

if (!service) {
  console.log("Missing service name");
  process.exit(1);
}

console.log(`muly:STEP`, { _, step, service });

let out = "";

async function updateGcpSecret(secretName, secretValue) {
  try {
    // Check if the secret exists
    await $`gcloud secrets describe ${secretName}`;
  } catch (error) {
    // If the secret does not exist, create it
    await $`gcloud secrets create ${secretName} --replication-policy="automatic"`;
  }

  // Create a temporary file
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `gcp_secret_${secretName}_tmp.txt`);

  // Write the secret value to the temporary file
  await fs.writeFile(tmpFile, secretValue, "utf8");

  // Add a new version to the secret or update the existing secret
  await $`gcloud secrets versions add ${secretName} --data-file=${tmpFile}`;

  // Remove the temporary file
  await fs.unlink(tmpFile);

  console.log(
    `New version of secret "${secretName}" added with value: "${secretValue}"`
  );
}

for (const site of sites) {
  if (service && site.name !== service) {
    continue;
  }

  const {
    domain,
    name,
    dev = {},
    prod,
    LEGACY_PHP_URL,
    user,
    password,
    db,
  } = site;

  if (deployProd) {
    if (!prod) {
      continue;
    }
    prod.service = `${name}-prod`;
  }
  if (!deployProd) {
    dev.service = `${name}-dev`;
    dev.domain = `${name}.staging.affiliatets.com`;
  }
  const databaseUrl = `mysql://${user}:${encodeURIComponent(password).replace(
    "@",
    "%40"
  )}@35.204.215.28:3306/${db}`;
  const secretName = `${
    deployProd ? "PROD" : "DEV"
  }_${name.toUpperCase()}_DATABASE_URL`;

  const val = deployProd ? prod : dev;
  let txt = "";

  if (step === "secret-list") {
    await $`gcloud secrets describe ${secretName}`;
  }
  if (step === "secret") {
    console.log(`Create secret ${secretName}`);
    await updateGcpSecret(secretName, databaseUrl);
  }

  if (step === "create") {
    if (deployProd) {
      txt = `
      - id: "deploy_${name}"
        name: deploy ${name}
        uses: "google-github-actions/deploy-cloudrun@v1"
        with:
          service: "${name}-prod"
          image: "europe-docker.pkg.dev/api-front-dashbord/production/aff:latest"
          labels: env=prod
          project_id: api-front-dashbord
          region: europe-west1
          secrets: |
            DATABASE_URL=PROD_${name.toUpperCase()}_DATABASE_URL:latest
            LEGACY_PHP_ACCESS_TOKEN=PROD_LEGACY_PHP_ACCESS_TOKEN:latest
            NEXTAUTH_SECRET=PROD_NEXTAUTH_SECRET:latest
            SENDGRID_API_KEY=SENDGRID_API_KEY:latest
            GCS_CONFIG_CLIENT_EMAIL=GCS_CONFIG_CLIENT_EMAIL:latest
            GCS_CONFIG_PRIVATE_KEY=GCS_CONFIG_PRIVATE_KEY:latest
          env_vars: |
            LEGACY_PHP_URL=https://${LEGACY_PHP_URL}
            NEXTAUTH_URL=https://${prod.domain}
            NODE_ENV=production
          flags: |
            --allow-unauthenticated
            --vpc-connector=production-serverless-vp
            --vpc-egress=all-traffic
            --port=3000
            --max-instances=5
            --min-instances=0

    `;
    } else {
      txt = `
      - id: "deploy_${name}"
        name: deploy ${name}-staging
        uses: "google-github-actions/deploy-cloudrun@v1"
        with:
          service: "${name}-staging"
          image: "europe-docker.pkg.dev/api-front-dashbord/dev/aff:latest"
          labels: env=dev
          project_id: api-front-dashbord
          region: europe-west1
          secrets: |
            DATABASE_URL=DEV_${name.toUpperCase()}_DATABASE_URL:latest
            LEGACY_PHP_ACCESS_TOKEN=DEV_LEGACY_PHP_ACCESS_TOKEN:latest
            NEXTAUTH_SECRET=DEV_NEXTAUTH_SECRET:latest
            SENDGRID_API_KEY=SENDGRID_API_KEY:latest
            GCS_CONFIG_CLIENT_EMAIL=GCS_CONFIG_CLIENT_EMAIL:latest
            GCS_CONFIG_PRIVATE_KEY=GCS_CONFIG_PRIVATE_KEY:latest
          env_vars: |
            LEGACY_PHP_URL=https://${LEGACY_PHP_URL}
            NEXTAUTH_URL=https://${dev.domain}
            NODE_ENV=production
          flags: |
            --allow-unauthenticated
            --vpc-connector=development-serverless-vp
            --vpc-egress=all-traffic
            --port=3000
            --max-instances=3
            --min-instances=0

    `;
    }

    console.log(txt);
    out += txt;
  }

  if (step === "verify") {
    console.log(
      `Will open GCP page, select namecheap and verify, copy TXT to deploy.secrets.mjs`
    );
    await $`gcloud domains verify ${val.domain}`;
    // console.log(
    //   `not working need to do it manually. see docs/deploy/new-customer-deploy.md ##Verify domain"
    //
    //   service: ${val.service}
    //   domain: ${val.domain}
    //
    //   `
    // );
  }

  if (step === "dns") {
    console.log(`DOMAIN: ${val.domain}
TXT: ${val.TXT}
CNAME: ghs.googlehosted.com (Make sure to DISABLE proxy)
`);
  }

  if (step === "vercel-env") {
    const env = envTemplate;
    await $`vercel link --scope=aff --project=${name} -y`;

    async function setEnv(variableName, value, env = null) {
      try {
        await $`vercel env rm ${variableName} ${env || "production"} -y`;
      } catch (e) {
        // Ignore
      }
      await $`echo ${value} | vercel env add ${variableName} ${
        env || "production"
      }`;
    }

    await setEnv("DATABASE_URL", env.DATABASE_URL);
    await setEnv("NEXTAUTH_SECRET", env.NEXTAUTH_SECRET);
    await setEnv("LEGACY_PHP_ACCESS_TOKEN", env.LEGACY_PHP_ACCESS_TOKEN);
    await setEnv(
      "SENTRY_IGNORE_API_RESOLUTION_ERROR",
      env.SENTRY_IGNORE_API_RESOLUTION_ERROR
    );
    await setEnv("SENDGRID_API_KEY", env.SENDGRID_API_KEY);
    await setEnv(
      "NEXT_PUBLIC_FLAGS_ENV_KEY",
      env.NEXT_PUBLIC_FLAGS_ENV_KEY,
      "production"
    );
    await setEnv(
      "NEXT_PUBLIC_FLAGS_ENV_KEY",
      env.NEXT_PUBLIC_FLAGS_ENV_KEY_PREVIEW,
      "preview"
    );
    await setEnv("NEXT_PUBLIC_API", `https://${name}.backend.affiliatets.com`);
    await setEnv("LEGACY_PHP_URL", LEGACY_PHP_URL);
  } else if (step === "db-connection") {
    console.log(`DATABASE_URL="${databaseUrl}"`);
  }
}

if (out) {
  const fileName = "./tmp/deploy-process.txt";
  await fs.writeFile(fileName, out);
  console.log(`Written to ${fileName}`);
}
