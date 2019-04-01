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
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log("For k of ", k, " Accuracy: ", accuracy + "%");
  })
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [
        distance(_.initial(row), point),
        _.last(row)
      ]
    })
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
  return _.chain(pointA)
    .zip(pointB)
    .map((a, b) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}


function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
