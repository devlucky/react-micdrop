const execSync = require('child_process').execSync;

const isPrBuild = (prBranch) => {
  return prBranch && prBranch !== "master";
};

const staticSizeNotTooLarge = (staticBookSize) => {
  const tenMB = 10 * (2 << 9);
  return !isNaN(staticBookSize) && staticBookSize < tenMB;
};

const {TRAVIS_PULL_REQUEST_BRANCH: prBranch} = process.env;
console.log(prBranch);
if (isPrBuild(prBranch)) {
  const result = execSync(`du -sk storybook-static | sed 's/[^0-9]*//g'`);
  const staticBookSize = Number.parseInt(result.toString());

  if (staticSizeNotTooLarge(staticBookSize)) {
    const result = execSync(
      `aws s3 cp ${__dirname}/../storybook-static s3://react-audio-vis-prs/${prBranch} --recursive`,
      {stdio: [0, 1, 2]}
    );
  }
}
