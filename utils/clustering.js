const clusteringThreshold = 20;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

const areImagesClose = (image1, image2) => {
  const distance = calculateDistance(
    image1.location.coordinates[1],
    image1.location.coordinates[0],
    image2.location.coordinates[1],
    image2.location.coordinates[0],
  );
  return distance <= clusteringThreshold;
};

const clusterImages = (imageData) => {
  const clusteredMarkers = [];
  const remainingMarkers = [...imageData];

  while (remainingMarkers.length > 0) {
    const currentImage = remainingMarkers.pop();
    const cluster = [currentImage];

    for (let i = remainingMarkers.length - 1; i >= 0; i--) {
      if (areImagesClose(currentImage, remainingMarkers[i])) {
        cluster.push(remainingMarkers[i]);
        remainingMarkers.splice(i, 1);
      }
    }

    clusteredMarkers.push(cluster);
  }
  return clusteredMarkers;
};

module.exports = { clusterImages };
