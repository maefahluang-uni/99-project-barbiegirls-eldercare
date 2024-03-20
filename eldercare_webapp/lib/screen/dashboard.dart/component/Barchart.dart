import 'package:charts_flutter_new/flutter.dart' as charts;
import 'package:flutter/material.dart';
import 'package:eldercare_webapp/constants.dart';

class TransitionBarChart extends StatelessWidget {
  final List<charts.Series<dynamic, String>> seriesList;
  final bool? animate;

  const TransitionBarChart(this.seriesList, {super.key, this.animate});

  /// Creates a [BarChart] with sample data and no transition.
  factory TransitionBarChart.withSampleData() {
    return TransitionBarChart(
      _createTransitionData(),
      // Disable animations for image tests.
      animate: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return charts.BarChart(
      seriesList,
      animate: animate,
    );
  }

  /// Create one series with sample hard coded data.
  static List<charts.Series<OrdinalSales, String>> _createTransitionData() {
    final data = [
      OrdinalSales('Young old', 55),
      OrdinalSales('Middle old', 25),
      OrdinalSales('Very old', 100),
      
    ];

    return [
      charts.Series<OrdinalSales, String>(
      id: 'days',
      colorFn: (OrdinalSales sales, _) {
        if (sales.age == 'Young old') {
          return charts.ColorUtil.fromDartColor(youngold);
        } else if (sales.age == 'Middle old') {
          return charts.ColorUtil.fromDartColor(middleold);
        } else if (sales.age == 'Very old') {
          return charts.ColorUtil.fromDartColor(veryold);
        } else {
          return charts.ColorUtil.fromDartColor(Colors.grey);
        }
      },
      domainFn: (OrdinalSales sales, _) => sales.age,
      measureFn: (OrdinalSales sales, _) => sales.days,
      data: data,
    )
    ];
  }
}

class SitBarChart extends StatelessWidget {
  final List<charts.Series<dynamic, String>> seriesList;
  final bool? animate;

  const SitBarChart(this.seriesList, {super.key, this.animate});

  /// Creates a [BarChart] with sample data and no transition.
  factory SitBarChart.withSampleData() {
    return SitBarChart(
      _createSitData(),
      // Disable animations for image tests.
      animate: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return charts.BarChart(
      seriesList,
      animate: animate,
    );
  }

  /// Create one series with sample hard coded data.
  static List<charts.Series<OrdinalSales, String>> _createSitData() {
    final data = [
      OrdinalSales('Young old', 55),
      OrdinalSales('Middle old', 25),
      OrdinalSales('Very old', 100),
      
    ];

    return [
      charts.Series<OrdinalSales, String>(
      id: 'days',
      colorFn: (OrdinalSales sales, _) {
        if (sales.age == 'Young old') {
          return charts.ColorUtil.fromDartColor(youngold);
        } else if (sales.age == 'Middle old') {
          return charts.ColorUtil.fromDartColor(middleold);
        } else if (sales.age == 'Very old') {
          return charts.ColorUtil.fromDartColor(veryold);
        } else {
          return charts.ColorUtil.fromDartColor(Colors.grey);
        }
      },
      domainFn: (OrdinalSales sales, _) => sales.age,
      measureFn: (OrdinalSales sales, _) => sales.days,
      data: data,
    )
    ];
  }
}

class SleepBarChart extends StatelessWidget {
  final List<charts.Series<dynamic, String>> seriesList;
  final bool? animate;

  const SleepBarChart(this.seriesList, {super.key, this.animate});

  /// Creates a [BarChart] with sample data and no transition.
  factory SleepBarChart.withSampleData() {
    return SleepBarChart(
      _createSleepData(),
      // Disable animations for image tests.
      animate: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return charts.BarChart(
      seriesList,
      animate: animate,
    );
  }

  /// Create one series with sample hard coded data.
  static List<charts.Series<OrdinalSales, String>> _createSleepData() {
    final data = [
      OrdinalSales('Young old', 55),
      OrdinalSales('Middle old', 25),
      OrdinalSales('Very old', 100),
      
    ];

    return [
      charts.Series<OrdinalSales, String>(
      id: 'days',
      colorFn: (OrdinalSales sales, _) {
        if (sales.age == 'Young old') {
          return charts.ColorUtil.fromDartColor(youngold);
        } else if (sales.age == 'Middle old') {
          return charts.ColorUtil.fromDartColor(middleold);
        } else if (sales.age == 'Very old') {
          return charts.ColorUtil.fromDartColor(veryold);
        } else {
          return charts.ColorUtil.fromDartColor(Colors.grey);
        }
      },
      domainFn: (OrdinalSales sales, _) => sales.age,
      measureFn: (OrdinalSales sales, _) => sales.days,
      data: data,
    )
    ];
  }
}

class StandBarChart extends StatelessWidget {
  final List<charts.Series<dynamic, String>> seriesList;
  final bool? animate;

  const StandBarChart(this.seriesList, {super.key, this.animate});

  /// Creates a [BarChart] with sample data and no transition.
  factory StandBarChart.withSampleData() {
    return StandBarChart(
      _createStandData(),
      // Disable animations for image tests.
      animate: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return charts.BarChart(
      seriesList,
      animate: animate,
    );
  }

  /// Create one series with sample hard coded data.
  static List<charts.Series<OrdinalSales, String>> _createStandData() {
    final data = [
      OrdinalSales('Young old', 55),
      OrdinalSales('Middle old', 25),
      OrdinalSales('Very old', 100),
      
    ];

    return [
      charts.Series<OrdinalSales, String>(
      id: 'days',
      colorFn: (OrdinalSales sales, _) {
        if (sales.age == 'Young old') {
          return charts.ColorUtil.fromDartColor(youngold);
        } else if (sales.age == 'Middle old') {
          return charts.ColorUtil.fromDartColor(middleold);
        } else if (sales.age == 'Very old') {
          return charts.ColorUtil.fromDartColor(veryold);
        } else {
          return charts.ColorUtil.fromDartColor(Colors.grey);
        }
      },
      domainFn: (OrdinalSales sales, _) => sales.age,
      measureFn: (OrdinalSales sales, _) => sales.days,
      data: data,
    )
    ];
  }
}

/// Sample ordinal data type.
class OrdinalSales {
  final String age;
  final int days;

  OrdinalSales(this.age, this.days);
}

 