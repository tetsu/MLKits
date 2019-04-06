require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('./load-csv');

let {features, labels, testFeatures, testLabels} = loadCSV('kc_house_data.csv', {
    shuffle: true,
    splitTest: 10,
    dataColumns: ['lat', 'long', 'sqft_living', 'sqft_lot'],
    labelColumns: ['price']
});

function knn(features, labels, predictionPoint, k=2) {
	const features_tf = tf.tensor(features);
	const labels_tf = tf.tensor(labels);
	const predictionPoint_tf = tf.tensor(predictionPoint);

	const {mean, variance} = tf.moments(features_tf, 0);
	const scaledPrediction = predictionPoint_tf.sub(mean).div(variance.pow(0.5));

	return features_tf
		.sub(mean)
		.div(variance.pow(0.5))
		.sub(scaledPrediction)
		.pow(2)
		.sum(1)
		.pow(0.5)
		.expandDims(1)
		.concat(labels_tf, 1)
		.unstack()
		.sort((a, b) => a.get(0) > b.get(0) ? 1 : -1)
		.slice(0, k)
		.reduce((acc, pair)=> acc+pair.get(1), 0) / k;
}

testFeatures.forEach((testPoint, i) => {
	const result = knn(features, labels, testPoint, 10);
	const err = (testLabels[i][0] - result) / testLabels[i][0];
	console.log('Guess', result, 'Actual', testLabels[i][0], 'Error', err*100);
});
