import angular from 'angular';
import { Alerts } from './alerts';

angular.module('app', []);

function TableController($scope, $element, $attrs, AlertsService) {
	var ctrl = this;

	ctrl.cols = [
		{
			name: 'Status',
			type: 'status'
		},
		{
			name: 'Type',
			type: 'alert_type'
		},
		{
			name: 'Entity',
			type: 'entity.name'
		},
		{
			name: 'Timestamp',
			type: 'timestamp'
		},
	];

	AlertsService.getAlerts()
		.then((res) => {
			ctrl.alerts = res.data.alerts;
		})
		.catch((err) => {
			console.log(err);
		});
}

angular.module('app').component('alertTable', {
  template: `
	  <div class="container-fluid">

	  	<div class="row">
	  		<h1>Alerts Table</h1>
	  	</div>

		  <div class="row">
			  <div class="col" ng-repeat="(key, val) in $ctrl.cols"> 
				{{val.name}}
			  </div>
		  </div>

	  	<div id="accordion" role="tablist" aria-multiselectable="true">
  		  <div class="card" ng-repeat="(key, val) in $ctrl.alerts">
		    <table-row key="key" alert="val" cols="$ctrl.cols"></table-row>
		  </div>
		</div>
	  </div>
  `,
  controller: TableController
});

function TableRowController() {
	var ctrl = this;

	this.$onInit = () => {
		ctrl.cols = this.cols;
		ctrl.key = this.key;
		ctrl.alert = this.alert;
	};
}

angular.module('app').component('tableRow', {
	template: `
		<div class="card-header" role="tab" id="headingOne">
	      <h5 class="mb-0">
	        <a data-toggle="collapse" data-parent="#accordion" href="#collapse{{$ctrl.key}}" aria-expanded="true" aria-controls="collapseOne">
	        	<div class="row">
	        		<div class="col" ng-repeat="col in $ctrl.cols">
						<small ng-if="col.name == 'Entity'">{{$ctrl.alert.entity.name}}</small>
						<small ng-if="col.name != 'Entity'">{{$ctrl.alert[col.type]}}</small>
				  	</div>
	        	</div>
	        </a>
	      </h5>
	    </div>
	    <div id="collapse{{$ctrl.key}}" class="collapse hide" role="tabpanel" aria-labelledby="headingOne">
		    <alert-cell alert="$ctrl.alert"></alert-cell>
		</div>
	`,
	bindings: {
		cols: '<',
		key: '<',
		alert: '<'
	},
	controller: TableRowController
});

function CellController() {
	var ctrl = this;

	this.$onInit = () => {
		ctrl.alert = this.alert;
	};
}

angular.module('app').component('alertCell', {
	template: `
		<div class="card-block">
			<div class="container">
				<div class="row">
		      		<div class="col">
		        		<p><strong>Alert Id</strong>: {{$ctrl.alert.id}}</p>
		        		<p><strong>Perpetrator</strong>: {{$ctrl.alert.perpetrator.username}}</p>
		        		<p><strong>Reviewed</strong>: {{$ctrl.alert.reviewed}}</p>
		        		<p><a ng-href="{{$ctrl.alert.offending_content_url}}" target="_blank">Link to Offending Content</a></p>
		        	</div>
		        	<div class="col">
		        		<p><strong>Entity</strong></p>
		        		<p><img ng-src="{{$ctrl.alert.entity.image}}" width="100" height="100"/></p>
		        	</div>
		        </div>
	        </div>
        </div>
	`,
	bindings: {
		alert: '<'
	},
	controller: CellController
});

/*
	Alerts Service
*/
function AlertsService($http) {
	const apiUrl = 'https://api-qa.zerofox.com/1.0/alerts/';

	this.getAlerts = function() {
		var config = {
			method: 'GET',
			url: apiUrl,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token 10affdf51091e4a5a154ed9be8ff1630b873e976'
			},
			params: {
				limit: 10
			}
		};

		return $http(config)
	}
}
angular.module('app').service('AlertsService', AlertsService);