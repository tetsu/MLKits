const outputs = [];
// const k = 300;
const testSetSize = 50;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  let successCount = 0;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  // for (let i=0; i<testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   console.log(bucket, testSet[i][3]);
  //   if (bucket === testSet[i][3]) successCount++;
  // }
  // const accuracy = successCount / testSetSize * 100;

  _.range(1, 15).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log("k", k, " Accuracy: ", accuracy + "%");
  })
}

function knn(data, pointB, k) {
  return _.chain(data)
    .map(row => [distance(row[0], pointB), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
