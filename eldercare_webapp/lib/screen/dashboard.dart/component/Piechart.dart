import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../../constants.dart';

class Chart extends StatelessWidget {
  const Chart({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 180,
      child: Stack(
        children: [
          PieChart(
            PieChartData(
              sectionsSpace: 0,
              centerSpaceRadius: 50,
              startDegreeOffset: -90,
              sections: paiChartSelectionData,
            ),
          ),
          Positioned.fill(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: defaultPadding),
                Text(
                  "36",
                  style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                        color: primaryColor,
                        fontWeight: FontWeight.w600,
                        height: 0.5,
                      ),
                ),
                SizedBox(height: defaultPadding),
                Text("Total of Patients",style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                        color: primaryColor,
                        fontWeight: FontWeight.w600,
                        fontSize: 8,
                        height: 0.5,))
              ],
            ),
          ),
        ],
      ),
    );
  }
}

List<PieChartSectionData> paiChartSelectionData = [
  PieChartSectionData(
    color: youngold,
    value: 25,
    showTitle: false,
    radius: 22,
  ),
  PieChartSectionData(
    color: middleold,
    value: 20,
    showTitle: false,
    radius: 22,
  ),
  PieChartSectionData(
    color: veryold,
    value: 10,
    showTitle: false,
    radius: 22,
  ),
 
];