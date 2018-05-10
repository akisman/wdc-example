(function () {
    var myConnector = tableau.makeConnector();
    var token, id;

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "post_id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "message",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "reach",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "reach_organic",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "reach_paid",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "impressions",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "interactions",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "engagement",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "content_relevance",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "loyalty",
            dataType: tableau.dataTypeEnum.float
        }];
    
        var tableSchema = {
            id: "post_metrics",
            alias: "Facebook Metrics",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {

        var params = JSON.parse(tableau.connectionData);
        var token = params.token;
        var id = params.id;

        $.ajax({
            type: "POST",
            url: "http://xlabs.xplain360.com/api/v1/posts",
            // url: "http://drupal.docker.localhost:8000/api/v1/posts",
            async: true,
            //dataType: "json",
            data: {"token": token, "id": id},
            beforeSend: function (xhr, sets) {
            },
            error: function (xhr, status, thrown) {
            },
            success: function (data, status, xhr) {
                
                var tableData = [];
                var ret_result = data;

                for (var i = 0, len = ret_result.length; i < len; i++) {
                    tableData.push({
                        "post_id": ret_result[i].post_id,
                        "message": ret_result[i].message,
                        "date": ret_result[i].date,
                        "reach": ret_result[i].metrics.reach,
                        "reach_organic": ret_result[i].metrics.reach_organic,
                        "reach_paid": ret_result[i].metrics.reach_paid,
                        "impressions": ret_result[i].metrics.impressions,
                        "interactions": ret_result[i].metrics.interactions,
                        "engagement": ret_result[i].calculated_metrircs.engagement,
                        "content_relevance": ret_result[i].calculated_metrircs.content_relevance,
                        "loyalty": ret_result[i].calculated_metrircs.loyalty
                    });
                }
        
                table.appendRows(tableData);

                doneCallback();

            }
        });

    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            
            var params = {
                token: $('#token').val().trim(),
                id: $('#id').val().trim()
            };

            tableau.connectionData = JSON.stringify(params); // Use this variable to pass data to your getSchema and getData functions
            tableau.connectionName = "XPLAIN Facebook Posts";
            tableau.submit();
        });
    });
    

})();
