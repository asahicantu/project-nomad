import assert from 'node:assert/strict'
import test from 'node:test'
import { Readable } from 'node:stream'
import { loadResultsArrayStreams } from '../../util/drug_labels.js'

test('loadResultsArrayStreams emits one {key,value} per results element', async () => {
  const { jsonParser, pick, streamArray } = (await loadResultsArrayStreams())()
  // Split mid-array so the parser has to stitch chunks.
  const src = Readable.from(['{"meta":{"x":[9]},"results":[{"set_id":"a"},', '{"set_id":"b"}]}'])
  const out: unknown[] = []
  for await (const chunk of src.pipe(jsonParser).pipe(pick).pipe(streamArray)) out.push(chunk)
  assert.deepEqual(out, [
    { key: 0, value: { set_id: 'a' } },
    { key: 1, value: { set_id: 'b' } },
  ])
})
