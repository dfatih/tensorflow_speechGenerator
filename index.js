// Quelle: https://stackoverflow.com/questions/41654006/numpy-random-choice-in-javascript
function randomChoice(p) {
    var rnd = p.reduce(function (a, b) {
        return a + b;
    }) * Math.random();
    return p.findIndex(function (a) {
        return (rnd -= a) < 0;
    });
}

var loadModel = _.once(function() {
    return tf.loadModel("data/modeluint8/model.json", false);
})

jQuery(document).ready(function($) {
    var speechElement = $("#trump-speech");

    $("#trump-generate").click(function() {
        speechElement.text("Loading model, generating speech...");

        loadModel().then(function(model) {
            var text = [];
            
            var generate = function(i) {
                if (i > 100) {
                    return;
                }
                tf.tidy(function() {
                    var prediction = model.predict(tf.tensor2d(input, [1, 40]));
                    // prediction.print();
                
                    var data = prediction.dataSync();
                    var wordIndex = randomChoice(data);
                    input.push(wordIndex);
                    input.shift();
        
                    if(words[wordIndex].length > 1 || words[wordIndex].match("[A-Za-z\$0-9]")) {
                        text.push(" ");
                    }
                    text.push(words[wordIndex]);
                    speechElement.text(text.join(""));
                })
                setTimeout(function() {
                    generate(i+1)
                }, 1);
                
            }

            var input = [
                6850, 6559, 6976, 21, 6509,6850, 6559, 4703, 6495, 2992,
                4003, 24, 964, 4664, 6495, 5187, 5008, 1005, 24, 1676, 
                6493, 17, 6495, 6876, 4427, 4420, 24, 1894, 6055, 24, 
                1976, 6493, 5845, 21, 5073, 2992, 4420, 5588, 4098, 4281
            ];
            
            generate(0);
        })
    });

    
})
