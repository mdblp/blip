/**
 * Full-template snapshots.
 *
 * These are a migration harness rather than a permanent gate. The property
 * assertions elsewhere answer "is TLS still 1.2?"; a snapshot answers "which
 * lines of CloudFormation changed, and did any resource get a new logical ID?" —
 * in the pull request, where a reviewer can see a resource replacement coming
 * before it reaches a deploy. For a change under IEC 81001-5-1 that diff is the
 * impact-analysis evidence.
 *
 * A diff here means an infrastructure change. Read it; do not run `jest -u`
 * reflexively. Asset hashes are redacted by test/setup/snapshot-serializer.js so
 * the noise from aws-cdk-lib bumps does not bury the signal.
 *
 * Once the construct migration has landed and settled, consider deleting these —
 * the property assertions are what earns a permanent place in CI.
 */
import { synthWeb, synthEdge } from './helpers/synth'

it('web stack matches the committed baseline', () => {
  expect(synthWeb().template.toJSON()).toMatchSnapshot()
})

it('web stack matches the committed baseline in maintenance mode', () => {
  expect(synthWeb(true).template.toJSON()).toMatchSnapshot()
})

it('edge stack matches the committed baseline', () => {
  expect(synthEdge().template.toJSON()).toMatchSnapshot()
})
