import { IReservationData } from '../../ui/frontdesk/Frontdesk';
import moment from 'moment';

export class ReservationModel {

  private loggedUserData: any;

  public params: IReservationData = {
    "pos": {
      "source": {
        "requestorID": {
          "id": "BMPMS",
          "type": "14"
        },
        "bookingChannel": {
          "companyName": {
            "value": "DirectBooking",
            "code": "6"
          },
          "primary": "1",
          "type": "5"
        }
      }
    },
    "hotelReservations": {
      "hotelReservation": [
        {
          "uniqueID": {
            "id": "",
            "type": "18"
          },
          "roomStays": {
            "roomStay": [
              {
                "ratePlans": {
                  "ratePlan": [
                    {
                      "mealsIncluded": {
                        "mealPlanIndicator": "0",
                        "mealPlanCodes": "",
                        "mealPlanDescription": ""
                      },
                      "ratePlanCode": null
                    }
                  ]
                },
                "roomRates": {
                  "roomRate": [
                    {
                      "rates": {
                        "rate": []
                      },
                      "numberOfUnits": null,
                      "ratePlanCode": null,
                      "roomTypeCode": null,
                      "roomTypeDesc": null,
                      "promotionCode": ""
                    }
                  ]
                },
                "guestCounts": {
                  "guestCount": [
                    {
                      "ageQualifyingCode": "10",
                      "count": null
                    },
                    {
                      "ageQualifyingCode": "8",
                      "count": null
                    }
                  ],
                  "isPerRoom": "1"
                },
                "timeSpan": {
                  "start": null,
                  "end": null
                },
                "guarantee": {
                  "guaranteesAccepted": {
                    "guaranteeAccepted": [
                      {
                        "paymentCard": {
                          "cardHolderName": "Dummy Card",
                          "cardCode": "VS",
                          "cardNumber": "4222222222222222",
                          "cardType": "1",
                          "expireDate": "1219",
                          "seriesCode": "123"
                        }
                      }
                    ]
                  },
                  "guranteeDescription": {
                    "text": ""
                  },
                  "guaranteeType": "GuaranteeRequired",
                  "guranteeCode": "GCC"
                },
                "total": {
                  "taxes": {
                    "tax": [
                      {
                        "code": "",
                        "percent": "",
                        "type": ""
                      }
                    ],
                    "amount": "",
                    "currenyCode": ""
                  },
                  "amountAfterTax": "",
                  "amountBeforeTax": "",
                  "currencyCode": "",
                  "tpaextensions": null
                },
                "basicPropertyInfo": {
                  "brandCode": "",
                  "chainCode": "",
                  "hotelCode": ""
                },
                "resGuestRPHs": {
                  "resGuestRPH": [
                    {
                      "rph": "1"
                    }
                  ]
                },
                "memberships": {
                  "membership": [
                    {
                      "accountID": "",
                      "programCode": ""
                    }
                  ]
                },
                "comments": {
                  "comment": [
                    {
                      "text": "test",
                      "guestViewable": "1"
                    }
                  ]
                },
                "specialRequests": {
                  "specialRequest": [
                    {
                      "content": "",
                      "codeContext": "",
                      "requestCode": ""
                    }
                  ]
                },
                "legNumber": null,
                "roomStaySeqNo": null,
                "numberOfUnits": null,
                "totalNoOfAdults": null,
                "totalNoOfChildren": null,
                "assignedRoomNumber": null,
                "rtroomStayID": null
              }
            ]
          },
          "resGuests": {
            "resGuest": []
          },
          "resGlobalInfo": {
            "hotelReservationIDs": {
              "hotelReservationId": [
                {
                  "resIDValue": null,
                  "resIDType": null,
                  "resIDSource": null
                }
              ]
            }
          },
          "createDateTime": moment().format('YYYY-MM-DD'),
          "creatorID": "bmpms",
          "lastModifierID": null,
          "lastModifyDateTime": null,
          "reservationStatus": null
        }
      ]
    },
    "resStatus": "Modify",
    "timeStamp": moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
    "version": "1.003"
  };

  constructor(bookingData: any, status: string) {

    this.params = {
      "pos": {
        "source": {
          "requestorID": bookingData.requestorID,
          "bookingChannel": {
            "companyName": {
              "value": "DirectBooking",
              "code": "6"
            },
            "primary": "1",
            "type": bookingData.requestorID.type
          }
        }
      },
      "hotelReservations": {
        "hotelReservation": [
          {
            "uniqueID": {
              "id": bookingData.uniqueID,
              "type": "18",
              "groupID": null
            },
            "roomStays": {
              "roomStay": [
                {
                  "ratePlans": {
                    "ratePlan": [
                      {
                        "mealsIncluded": {
                          "mealPlanIndicator": "0",
                          "mealPlanCodes": "",
                          "mealPlanDescription": ""
                        },
                        "ratePlanCode": bookingData.rateType
                      }
                    ]
                  },
                  "roomRates": {
                    "roomRate": [
                      {
                        "rates": {
                          "rate": bookingData.priceRateData
                        },
                        "numberOfUnits": bookingData.roomCount,
                        "ratePlanCode": bookingData.rateType,
                        "roomTypeCode": bookingData.roomType,
                        "roomTypeDesc": "",
                        "promotionCode": "",
                        "marketCode": bookingData.marketCode
                      }
                    ]
                  },
                  "guestCounts": {
                    "guestCount": [
                      {
                        "ageQualifyingCode": "10",
                        "count": bookingData.adultCount
                      },
                      {
                        "ageQualifyingCode": "8",
                        "count": bookingData.childCount
                      }
                    ],
                    "isPerRoom": "1"
                  },
                  "timeSpan": {
                    "start": bookingData.start,
                    "end": bookingData.end
                  },
                  "guarantee": {
                    "guaranteesAccepted": {
                      "guaranteeAccepted": [
                        {
                          "paymentCard": {
                            "cardHolderName": bookingData.cardHolderName,
                            "cardCode": bookingData.cardCode,
                            "cardNumber": bookingData.cardNumber,
                            "cardType": bookingData.cardType,
                            "expireDate": bookingData.expireDate,
                            "seriesCode": bookingData.seriesCode
                          }
                        }
                      ]
                    },
                    "guranteeDescription": {
                      "text": ""
                    },
                    "guaranteeType": bookingData.cardNumber.length > 0 ? "GuaranteeRequired" : 'None',
                    "guranteeCode": bookingData.cardNumber.length > 0 ? "GCC" : 'None'
                  },
                  "total": {
                    "taxes": {
                      "tax": [bookingData.taxDetails],
                      "amount": bookingData.taxAmount,
                      "currenyCode": ""
                    },
                    "amountAfterTax": bookingData.totalPrice,
                    "amountBeforeTax": (bookingData.totalPrice - bookingData.taxAmount).toFixed(2),
                    "currencyCode": "",
                    "tpaextensions": bookingData.tpaextensions
                  },
                  "basicPropertyInfo": {
                    "brandCode": "",
                    "chainCode": "",
                    "hotelCode": bookingData.hotelCode
                  },
                  "resGuestRPHs": {
                    "resGuestRPH": []
                  },
                  "memberships": {
                    "membership": [
                      {
                        "accountID": "",
                        "programCode": ""
                      }
                    ]
                  },
                  "comments": {
                    "comment": [
                      {
                        "text": "test",
                        "guestViewable": "1"
                      }
                    ]
                  },
                  "specialRequests": {
                    "specialRequest": [
                      {
                        "content": "",
                        "codeContext": "",
                        "requestCode": ""
                      }
                    ]
                  },
                  "legNumber": null,
                  "roomStaySeqNo": null,
                  "numberOfUnits": bookingData.roomCount,
                  "totalNoOfAdults": bookingData.adultCount,
                  "totalNoOfChildren": bookingData.childCount,
                  "assignedRoomNumber": bookingData.assignedRoomNumber,
                  "rtroomStayID": null
                }
              ]
            },
            "resGuests": {
              "resGuest": []
            },
            "resGlobalInfo": bookingData.resGlobalInfo,
            "createDateTime": bookingData.createDateTime,
            "creatorID": bookingData.creatorID,
            "lastModifierID": bookingData.lastModifierID,
            "lastModifyDateTime": "",
            "reservationStatus": ""
          }
        ]
      },
      "resStatus": "",
      "timeStamp": "",
      "version": "1.003"
    };
    if (status == 'cancel') {
      this.params.hotelReservations.hotelReservation[0].roomStays['cancellation'] = bookingData.cancellation;
      this.params.hotelReservations.hotelReservation[0].roomStays.roomStay[0].resGuestRPHs.resGuestRPH.push({
        "rph": ""
      });
      this.params.hotelReservations.hotelReservation[0].resGuests.resGuest = [
        {
          "profiles": {
            "profileInfo": [
              {
                "profile": {
                  "customer": {
                    "personName": {
                      "namePrefix": "",
                      "givenName": "",
                      "middleName": "",
                      "surname": ""
                    },
                    "telephone": {
                      "formattedInd": "0",
                      "phoneLocationType": "7",
                      "phoneNumber": "",
                      "phoneTechType": "3"
                    },
                    "email": {
                      "content": "",
                      "emailType": "2"
                    },
                    "address": {
                      "addressLine": "",
                      "cityName": "",
                      "postalCode": "",
                      "stateProv": {
                        "stateCode": ""
                      },
                      "countryName": {
                        "code": null
                      },
                      "type": null
                    }
                  },
                  "profileType": "1"
                }
              }
            ]
          },
          "arrivalTransport": {
            "transportInfo": {
              "id": "",
              "time": "",
              "type": ""
            }
          },
          "departureTransport": {
            "transportInfo": {
              "id": "",
              "time": "",
              "type": ""
            }
          },
          "resGuestRPH": "1",
          "rtguestID": null
        }
      ];
      this.params.hotelReservations.hotelReservation[0].reservationStatus = "Cancel";
      this.params.hotelReservations.hotelReservation[0].lastModifyDateTime = moment().format('YYYY-MM-DD HH:mm:ss.S');
      this.params.resStatus = "Cancel";
      this.params.timeStamp = moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
    }
  }

  getRequestObject() {
    return this.params;
  }
}