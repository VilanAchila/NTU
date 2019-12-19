export class JsLoader {
    public static loadScript() {
        var isFound = false;
        var scripts = document.getElementsByTagName("script")
        for (var i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
                isFound = true;
            }
        }

        if (!isFound) {
            var dynamicScripts = ["assets/js/d3.v3.min.js","assets/js/drawChart.js"];

            for (var i = 0; i < dynamicScripts .length; i++) {
                //let isAvailable = document.querySelector('[src="' + dynamicScripts [i] + '"]');
                let node = document.createElement('script');
                node.src = dynamicScripts [i];
                node.type = 'text/javascript';
                node.async = false;
                node.charset = 'utf-8';
                document.getElementsByTagName('head')[0].appendChild(node);
            }

        }
    }
}
